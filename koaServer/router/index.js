/**
 * Created by sunharuka on 14-7-25.
 */
var router       = require('koa-route');
var OrderHandler = require('./order');
var CarInfoHandler = require('./carInfo');
var WXHandler = require('./wxRouter');
module.exports = function(app,db){
  var orderHandler = new OrderHandler(db);
  var carInfoHandler = new CarInfoHandler(db);
  var wxHandler = new WXHandler(db);

  app.use(router.get('/neworder', orderHandler.newOrder));

  app.use(router.post('/getCarSubBrands',carInfoHandler.getSubCarBrand));

  app.use(router.post('/getCarModel',carInfoHandler.getCarModel));

  app.use(router.get('/validate',wxHandler.index));
  app.use(router.post('/validate',wxHandler.index));

  app.use(router.get('/todos', function *() {
    this.body = JSON.stringify(todos);
  }));

  app.use(router.get('/source', function *() {
    var contents = yield fs.readFileAsync('./app.js', 'utf8');
    this.body = contents;
  }));

  app.use(router.delete('/todos/:id', function *(id) {
    todos = _(todos).reject(function (todo) {
      console.log('what? ', todo, id);
      return todo.id === parseInt(id, 10);
    }, this);
    console.log(todos);
    this.body = JSON.stringify(todos.sort(function (a, b) {
      return a - b;
    }));
  }));

}
