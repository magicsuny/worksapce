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

  var carInfo = db.collection("car");

}