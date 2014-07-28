/**
 * Created by sunharuka on 14-7-28.
 */
var render = require('../libs/render');
var parse = require('co-body');
var CarInfoDAO = require('../dao/carInfoDAO');
function CarInfoHandler (db) {
  var carInfoDAO = new CarInfoDAO(db);
  this.getSubCarBrand = function *(){
    var query = yield parse(this);
    var carSubBrands = yield carInfoDAO.getSubCarBrand(query.id);
    this.body =carSubBrands;
  }

  this.getCarModel = function *(){
    var query = yield parse(this);
    var carSubBrands = yield carInfoDAO.getCarModel(query.brandId,query.subBrandId);
    this.body =carSubBrands;
  }
}



module.exports = CarInfoHandler;