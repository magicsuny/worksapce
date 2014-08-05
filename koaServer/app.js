//jshint esnext
var koa = require('koa');
var config = require('./config');
var staticServer = require('koa-static');
var session = require('koa-session-store');
var mongoStore = require('koa-session-mongo');
//this allows us to parse the native req object to get the body

var router = require('./router');
var logger = require('koa-logger');
var path = require('path');
var mongoClient = require('mongodb').MongoClient;
var initDbService = require('./libs/services');
var app = koa();

// middleware
app.use(logger());
app.keys = ['koa-wxkey'];
//
app.use(session({
  store: mongoStore.create({
    url:config.mongo.url
  })
}));

//
app.use(staticServer(path.join(__dirname, 'public')));
mongoClient.connect(config.mongo.url, function (err, db) {
  initDbService.doJob(db);
  router(app,db);
  app.listen(config.port);
  console.log('Listening on '+config.port);
});

