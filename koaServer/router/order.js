/**
 * Created by sunharuka on 14-7-25.
 */
var parse = require('co-body');
var url = require('url');
var render = require('../libs/render');
var CarInfoDAO = require('../dao/carInfoDAO');
var UserDAO = require('../dao/userDAO');
var wechatService = require('../libs/wechatService');
function OrderHandler(db) {
  var carInfoDAO = new CarInfoDAO(db);
  var userDAO = new UserDAO(db);
  this.newOrder = function *() {
    var query = url.parse(this.req.url, true).query;
    var userInfo = null;
    var accessTokenInfo = null;
    if (query.code) {
      try {
        accessTokenInfo = yield wechatService.oAuthAccessTokenRequest(query.code);
      } catch (e) {
        this.status = 500;
        this.body = e.errmsg;
        return;
      }
      this.session.userId = accessTokenInfo.openid;
      this.session.accessToken = accessTokenInfo.access_token;
      console.log(accessTokenInfo.openid);
      userInfo = yield userDAO.loadUserById(accessTokenInfo.openid);
      console.log(userInfo);
    }

    var carBrands = yield carInfoDAO.getCarBrand();
    this.body = yield render('/order/neworder', {userInfo:userInfo,carBrands: carBrands});
  }


  this.saveOrder = function*() {
    var formBody = yield parse.form(this);
    this.body = yield render('/order/ordercomplete');
  }
}


module.exports = OrderHandler;