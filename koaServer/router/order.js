/**
 * Created by sunharuka on 14-7-25.
 */
var render = require('../libs/render');
var CarInfoDAO = require('../dao/carInfoDAO');
function OrderHandler (db) {
  var carInfoDAO = new CarInfoDAO(db);
  this.newOrder = function *(){
    var carBrands = yield carInfoDAO.getCarBrand();
    this.body = yield render('/order/neworder',{carBrands:carBrands});
  }
}


module.exports = OrderHandler;