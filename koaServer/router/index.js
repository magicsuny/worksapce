/**
 * Created by sunharuka on 14-7-25.
 */
var router       = require('koa-router');
var OrderHandler = require('./order');
var CarInfoHandler = require('./carInfo');
var WXHandler = require('./wxRouter');
module.exports = function(app,db){
  app.use(router(app));
  var orderHandler = new OrderHandler(db);
  var carInfoHandler = new CarInfoHandler(db);
  var wxHandler = new WXHandler(db);

  app.get('/neworder', orderHandler.newOrder);

  app.post('/getCarSubBrands',carInfoHandler.getSubCarBrand);

  app.post('/getCarModel',carInfoHandler.getCarModel);

  app.get('/validate',wxHandler.signature);
  app.post('/validate',wxHandler.onPostMessage);
  app.get('/createMenu',wxHandler.createMenu);

}
