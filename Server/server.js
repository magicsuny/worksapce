/**
 * Created by sunharuka on 13-10-29.
 */
var http = require('http'),
    url = require('url'),
    socketio = require('socket.io'),
    router = require('./router'),
    querystring = require('querystring'),
    config = require('./app').getConfig(),
    logger = require('./app').getLogger('sys'),
    cluster = require('cluster');

function onRequest(req,res){
    var _getData = '';
    var _postData = '';
    var getQuery= url.parse(req.url).query;
    _getData= querystring.parse(getQuery);
    req.getData = _getData;
    req.on('data',function(chunk){
        _postData += chunk;
    }).on('end',function(){
            req.post = _postData;
            router.handleRequest(req,res);
    });

}


exports.start = function(db){

    if (cluster.isMaster&&false) {

        var cpuCount = require('os').cpus().length;

        for (var i = 0; i < cpuCount; i++) {
            cluster.fork();
        }

        cluster.on('exit', function (worker) {
            console.log('Worker ' + worker.id + ' died!!!!');
            cluster.fork();
        });

    } else {
        var server = http.createServer(onRequest).listen(config.LISTEN_PORT,function(){
            logger.info('server is running!');
        });
        return server;
        console.log('Worker ' + cluster.worker.id + ' runing!');
    }
}