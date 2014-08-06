/**
 * Created by sunharuka on 14-7-28.
 */
function UserDAO(db) {
  "use strict";

  /* If this constructor is called without the "new" operator, "this" points
   * to the global object. Log a warning and call it correctly. */
  if (false === (this instanceof UserDAO)) {
    console.log('Warning: UserDAO constructor called without "new" operator');
    return new OrderDAO(db);
  }

  var users = db.collection("users");

  this.saveUser = function (user){
    return function(next){
      var query = {'_id':user._id};
      users.update(query,{$set:user},{ upsert: true, safe: true },next);
    }
  }
}


module.exports = UserDAO;