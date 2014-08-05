/**
 * Created by sunharuka on 14-7-31.
 */
var synClarListMongoService = require('./synCarListMongo');
var requireAccessToken = require('./../../router/weixin/weixinAccessTokenService');
exports.doJob = function (db) {
  synClarListMongoService.doJob(db);
  requireAccessToken.doJob(db);

}