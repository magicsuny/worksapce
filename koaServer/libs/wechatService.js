/**
 * Created by sunharuka on 14-8-6.
 */
var config = require('../config'),
WechatServiceCore = require('wechat-koa');
var wechatServiceCore = new WechatServiceCore({
  store: {type: 'mongo', url: config.mongo.url},
  appId: config.weixin.APP_ID,
  appSecret: config.weixin.APP_SECRET,
  token: config.weixin.TOKEN
});

module.exports = wechatServiceCore;