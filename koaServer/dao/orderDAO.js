/**
 * Created by sunharuka on 14-7-28.
 */
function OrderDAO(db) {
  "use strict";

  /* If this constructor is called without the "new" operator, "this" points
   * to the global object. Log a warning and call it correctly. */
  if (false === (this instanceof OrderDAO)) {
    console.log('Warning: OrderDAO constructor called without "new" operator');
    return new OrderDAO(db);
  }

  var orders = db.collection("orders");

  this.getCarModel = function (order){
    return function(callback){
      var query = {'brand.id':parseInt(brandId),'sub_brand.id':parseInt(subBrandId)};
      var cur = carInfo.find(query).sort({name:1});
      cur.toArray(callback);
    }
  }
}