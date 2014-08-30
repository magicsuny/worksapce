var parse = require('co-body'),
  co = require('koa/node_modules/co'),
  config = require('../config'),
  User = require('../model/user'),
  UserDAO = require('../dao/userDAO'),
  wechatServiceCore = require('../libs/wechatService');
function WXHandler(db) {
  var userDAO = new UserDAO(db);

  wechatServiceCore.on('subscribeEvent', function (err, obj) {
    if (err) {
      throw err;
    }
    var openId = obj.FromUserName;
    if (openId) {
      co(function*() {
        var obj = null;
        try {
          obj = yield wechatServiceCore.requestUserInfo(openId);
        } catch (e) {
          console.log(e);
        }
        if (obj) {
          var user = User.initWidthWechatUserInfo(obj);
          console.log(obj);
          console.log(user);
          yield userDAO.saveUser(user);
        }
      })();
    }
    console.log("user:" + openId + " subscribe");
    return true;
  });

  wechatServiceCore.on('unsubscribeEvent', function (err, obj) {
    console.log(obj);
  });

  /**
   * 微信校验方法
   */
  this.signature = function *() {
    if (this.req.url) {
      var echostr = wechatServiceCore.checkSignature(this.req.url)
      if (echostr) {
        this.body = echostr;
      } else {
        this.status = 500;
        this.body = "Bad Token!";
      }
    }
  }


  /**
   * 响应消息
   */
  this.onPostMessage = function *() {
    var check = wechatServiceCore.checkSignature(this.req.url);
    if (!check) {
      this.status = 500;
      this.body = 'Bad Token!';
      console.log(this.body);
    }
    var postQuery = yield parse.other(this);
    try{
      yield wechatServiceCore.parse(postQuery);
    }catch(e){
      console.log(postQuery+" parse ERROR! :"+e);
      this.status = 500;
      this.body = e.errmsg;
    }


    this.type = 'application/xml'
    try{
      this.body = yield responseMsgFunc();
    }catch(e){
      this.body = '';
    }

    console.log(this.body);
  }

  function responseMsgFunc(){
    return function(next){
      wechatServiceCore.once('textMsg', function (err, result) {
        var responseMsg = {
          "toUserName": result.FromUserName,
          "fromUserName": result.ToUserName,
          "createTime": new Date().getTime(),
          "msgType": "text",
          "content": "收到"
        };
        var resMsg = wechatServiceCore.build(responseMsg);
        next(err,resMsg);
      });

      wechatServiceCore.once('LOCATIONEvent', function (err, result) {

        next(err,'');
      });

      wechatServiceCore.once('locationMsg', function (err, result) {

        next(err,'');
      });
      //延迟处理其他未实现事件
      process.nextTick(function(){
        next(null,'');
      });

    }
  }
  /**
   * 创建菜单
   * @param data
   */
  this.createMenu = function *() {
    //var accessToken = yield accessTokenDAO.getAccessToken();
    var menuJson = {
      "button": [
        {
          "type": "click",
          "name": "我的",
          "sub_button": [
            {
              "type": "view",
              "name": "优惠券",
              "url": "http://106.187.50.51/coupon"
            },
            {
              "type": "view",
              "name": "保养记录",
              "url": "http://106.187.50.51/orderlist"
            },
            {
              "type": "view",
              "name": "我的积分",
              "url": "http://106.187.50.51/score"
            }
          ]
        },
        {
          "type": "view",
          "name": "预约",
          "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+config.weixin.APP_ID+"&redirect_uri=http://106.187.50.51/neworder&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect"
        },
        {
          "type": "click",
          "name": "你懂的",
          "sub_button": [
            {
              "type": "view",
              "name": "保险",
              "url": "http://www.ecpic.com.cn/"
            },
            {
              "type": "view",
              "name": "促销",
              "url": "http://www.meituan.com/"
            },
            {
              "type": "view",
              "name": "车友活动",
              "url": "http://club.ds.com.cn/"
            },
            {
              "type": "click",
              "name": "线下店",
              "key": "V1001_GOOD"
            },
            {
              "type": "click",
              "name": "app下载",
              "key": "V1001_GOOD"
            }
          ]
        }
      ]
    };
    yield wechatServiceCore.createMenu(menuJson);
    this.body = 'complete';
  }



}

module.exports = WXHandler;