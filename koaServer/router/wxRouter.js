var crypto = require("crypto"),
  https = require('https'),
  url = require('url'),
  parse = require('co-body'),
  config = require('../config'),
  WechatServiceCore = require('wechat-koa');
var wechatServiceCore = new WechatServiceCore({
  store: {type: 'mongo'},
  appId: config.weixin.appId,
  appSecret: config.weixin.appSecret,
  appToken: config.weixin.token
});
function WXHandler(db) {
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
    wechatServiceCore.parse(postQuery);
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
          "url": "http://106.187.50.51/neworder"
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

  wechatServiceCore.on('textMsg', function (err, result) {

  });

  wechatServiceCore.on('imageMsg', function (err, result) {

  });

  wechatServiceCore.on('voiceMsg', function (err, result) {

  });

  wechatServiceCore.on('videoMsg', function (err, result) {

  });

  wechatServiceCore.on('locationMsg', function (err, result) {

  });

  wechatServiceCore.on('linkMsg', function (err, result) {

  });


}

module.exports = WXHandler;