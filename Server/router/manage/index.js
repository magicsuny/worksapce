/**
 * Created by sunharuka on 13-10-30.
 */
var fs = require('fs'),
    logger = require('../../app').getLogger('sys'),
    socketio = require('socket.io').listen(require('../../app').server);

exports.index = function(req,res){
    res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/../../template/html/manage.html'));
    socketio.sockets.on('connection',function(socket){
        readLog(socket);
    });
}

function readLog(socket){
    fs.watchFile(__dirname+'/../../logs/server.log',function(curr,prev,dd,df){
        var readStream = fs.createReadStream(__dirname+'/../../logs/server.log',{start:prev.size,end:curr.size});
        readStream.on('data',function(chunk){
            //输出新增的日志内容
            socket.emit('message',chunk.toString());
            console.log(chunk.toString());
        });
    });
}