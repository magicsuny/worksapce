//jshint esnext
var koa = require('koa');
var staticServer = require('koa-static');

//this allows us to parse the native req object to get the body
var parse = require('co-body');

var router = require('./router');
var logger = require('koa-logger');
var path = require('path');
var mongoClient = require('mongodb').MongoClient;
var initDbService = require('./libs/synCarListMongo');
var app = koa();
//our very basic data store
var todos = [];

// middleware
app.use(logger());


//
app.use(staticServer(path.join(__dirname, 'public')));


mongoClient.connect('mongodb://127.0.0.1:27017/car', function (err, db) {
  initDbService.doJob(db);
  router(app,db);
  app.listen(80);
  console.log('Listening on 3000');
});
