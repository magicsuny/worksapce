/**
 * Created by sunharuka on 13-10-29.
 */
var http = require('http'),
    url = require('url'),
    socketio = require('socket.io'),
    router = require('./router'),
    querystring = require('querystring'),
    config = require('./app').getConfig(),
    logger = require('./app').getLogger('sys');

function onRequest(req,res){
    var _getData = '';
    var _postData = '';
    var getQuery= url.parse(req.url).query;
    _getData= querystring.parse(getQuery);
    req.getData = _getData;
    req.on('data',function(chunk){
        _postData += chunk;
    }).on('end',function(){
            req.post = querystring.parse(_postData);
            router.handleRequest(req,res);
    });

}


exports.start = function(){
    var server = http.createServer(onRequest).listen(config.LISTEN_PORT,function(){
        logger.info('server is running!');
    });
    return server;
}