/**
 * Created by sunharuka on 14-7-28.
 */
function CarInfoDAO(db) {
  "use strict";

  /* If this constructor is called without the "new" operator, "this" points
   * to the global object. Log a warning and call it correctly. */
  if (false === (this instanceof CarInfoDAO)) {
    console.log('Warning: PostsDAO constructor called without "new" operator');
    return new CarInfoDAO(db);
  }
  var carBrand = db.collection("carBrands");
  var carSubBrand = db.collection("carSubBrands");
  var carInfo = db.collection("cars");

  this.getCarBrand = function (){
    return function(callback){
      var cur = carBrand.find({}).sort({name:1});
      cur.toArray(callback);
    }
  }

  this.getSubCarBrand = function (id){
    return function(callback){
      var cur = carSubBrand.find({brandId:parseInt(id)}).sort({name:1});
      cur.toArray(callback);
    }
  }


  this.getCarModel = function (brandId,subBrandId){
    return function(callback){
      var query = {'brand.id':parseInt(brandId),'sub_brand.id':parseInt(subBrandId)};
      var cur = carInfo.find(query).sort({name:1});
      cur.toArray(callback);
    }
  }

}

module.exports = CarInfoDAO;