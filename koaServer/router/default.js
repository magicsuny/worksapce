/**
 * Created by sunharuka on 14-8-6.
 */
/**
 * Created by sunharuka on 14-7-25.
 */
var parse = require('co-body');
var render = require('../libs/render');
function DefaultHandler (db) {

  this.oauth = function *(){
    this.body = yield render('/oauth');
  }


}


module.exports = DefaultHandler;