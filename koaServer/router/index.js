/**
 * Created by sunharuka on 14-7-25.
 */
var router       = require('koa-router');
var OrderHandler = require('./order');
var DefaultHandler = require('./default');
var CarInfoHandler = require('./carInfo');
var WXHandler = require('./wxRouter');
module.exports = function(app,db){
  app.use(router(app));
  var orderHandler = new OrderHandler(db);
  var defaultHandler = new DefaultHandler(db);
  var carInfoHandler = new CarInfoHandler(db);
  var wxHandler = new WXHandler(db);
  app.get('/oauth',defaultHandler.oauth);

  app.get('/neworder', orderHandler.newOrder);
  app.get('/orderlist', orderHandler.orderList);
  app.get('/orderdetail', orderHandler.orderDetail);
  app.post('/saveorder', orderHandler.saveOrder);

  app.get('/coupon',orderHandler.coupon);

  app.get('/score',orderHandler.score);

  app.post('/getCarSubBrands',carInfoHandler.getSubCarBrand);

  app.post('/getCarModel',carInfoHandler.getCarModel);

  app.get('/validate',wxHandler.signature);
  app.post('/validate',wxHandler.onPostMessage);
  app.get('/createMenu',wxHandler.createMenu);

}
