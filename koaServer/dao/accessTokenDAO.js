/**
 * Created by sunharuka on 14-7-28.
 */
function AccessTokenDAO(db) {
  "use strict";

  /* If this constructor is called without the "new" operator, "this" points
   * to the global object. Log a warning and call it correctly. */
  if (false === (this instanceof AccessTokenDAO)) {
    console.log('Warning: OrderDAO constructor called without "new" operator');
    return new AccessTokenDAO(db);
  }

  var accessTokenCollection = db.collection("accessToken");

  /**
   * 更新accessToken
   * @param accessToken
   */
  this.updateAccessToken = function (accessToken) {
    accessTokenCollection.remove({}, function (err, result) {
      if (err) {
        throw err;
        return;
      }
      accessTokenCollection.insert({accessToken: accessToken}, function (err, result) {
        if (err) {
          throw err;
          return;
        }
        console.log('AccessToken updated');
      });
    })
  }

  /**
   * 获取accessToken
   * @returns {Function}
   */
  this.getAccessToken = function(){
    return function(callback){
      accessTokenCollection.findOne({},function(err,result){
        if(err){
          throw err
        }
        if(result.accessToken){
          callback(err,result.accessToken);
        }

      });
    }
  }

}


module.exports = AccessTokenDAO;