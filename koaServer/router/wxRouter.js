var parse = require('co-body'),
  co = require('koa/node_modules/co'),
  config = require('../config'),
  User = require('../model/user'),
  UserDAO = require('../dao/userDAO'),
  WechatServiceCore = require('wechat-koa');
var wechatServiceCore = new WechatServiceCore({
  store: {type: 'mongo', url: config.mongo.url},
  appId: config.weixin.APP_ID,
  appSecret: config.weixin.APP_SECRET,
  token: config.weixin.TOKEN
});
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
    }
    var postQuery = yield parse.other(this);
    var msg = yield wechatServiceCore.parse(postQuery);
    console.log(msg);

    this.type = 'application/xml'
    this.body = yield responseMsgFunc();
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

      wechatServiceCore.on('locationEvent', function (err, result) {

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
              "name": "我的订单",
              "url": "http://106.187.50.51/orderlist"
            },
            {
              "type": "view",
              "name": "车型设置",
              "url": "http://106.187.50.51/mycar"
            },
            {
              "type": "view",
              "name": "优惠券",
              "url": "http://106.187.50.51/mycar"
            },
            {
              "type": "view",
              "name": "保养记录",
              "url": "http://106.187.50.51/mycar"
            },
            {
              "type": "view",
              "name": "我的积分",
              "url": "http://106.187.50.51/mycar"
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
              "url": "http://v.qq.com/"
            },
            {
              "type": "click",
              "name": "促销",
              "key": "V1001_GOOD"
            },
            {
              "type": "click",
              "name": "车友活动",
              "key": "V1001_GOOD"
            },
            {
              "type": "click",
              "name": "线下店",
              "key": "V1001_GOOD"
            }
          ]
        }
      ]
    };
    wechatServiceCore.createMenu(menuJson);
  }



}

module.exports = WXHandler;