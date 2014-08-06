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
    query.code = '023becb87b97694cdb278ff34655a475';
    var userInfo = {};
    var accessTokenInfo = null;
    if (query.code) {
      try {
        accessTokenInfo = yield wechatService.oAuthAccessTokenRequest(query.code);
      } catch (e) {
        console.log(e);
        this.status = 500;
        this.body = e.errmsg;
        return;
      }
    }
    this.session.userId = accessTokenInfo.openid;
    this.session.accessToken = accessTokenInfo.access_token;
    userInfo = userDAO.loadUserById(accessTokenInfo.openid);
    console.log(userInfo);
    var carBrands = yield carInfoDAO.getCarBrand();
    this.body = yield render('/order/neworder', {userInfo:userInfo,carBrands: carBrands});
  }


  this.saveOrder = function*() {
    var formBody = yield parse.form(this);

  }
}


module.exports = OrderHandler;