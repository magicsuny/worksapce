/**
 * Created by sunharuka on 14-7-25.
 */
var parse = require('co-body');
var render = require('../libs/render');
var CarInfoDAO = require('../dao/carInfoDAO');
function OrderHandler (db) {
  var carInfoDAO = new CarInfoDAO(db);

  this.newOrder = function *(){
    this.session.test = 1;
    var carBrands = yield carInfoDAO.getCarBrand();
    this.body = yield render('/order/neworder',{carBrands:carBrands});
  }


  this.saveOrder = function*(){
    var formBody = yield parse.form(this);

  }
}


module.exports = OrderHandler;