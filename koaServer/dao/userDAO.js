/**
 * Created by sunharuka on 14-7-28.
 */
function UserDAO(db) {
  "use strict";

  /* If this constructor is called without the "new" operator, "this" points
   * to the global object. Log a warning and call it correctly. */
  if (false === (this instanceof UserDAO)) {
    console.log('Warning: UserDAO constructor called without "new" operator');
    return new UserDAO(db);
  }

  var users = db.collection("users");

  this.saveUser = function (user){
    return function(next){
      var query = {'_id':user._id};
      users.update(query,{$set:user},{ upsert: true, safe: true },next);
    }
  }

  this.loadUserById = function(id){
    return function(next){
      var query = {'_id':id};
      var cur = users.findOne(query);
      cur.toArray(function(err,result){
        if(result>0){
          next(err,result);
        }else{
          next(err,null);
        }
      });
    }
  }
}


module.exports = UserDAO;