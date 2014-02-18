/**
 * Created by sunharuka on 13-10-29.
 */
var url = require('url'),
    fs=require('fs'),
    mine = require('./mine'),
    path=require('path'),
    logger = require('../app').getLogger('router');

exports.handleRequest = function(req,res){
    var reqParam = url.parse(req.url);
    var pathname = reqParam.pathname;
    //判断是否静态资源
    var ext = path.extname(pathname);
    ext = ext ? ext.slice(1) : 'unknown';
    var resPath = mine.paths[ext]?mine.paths[ext]:'';
    var realPath = path.join("template",resPath, pathname);
    fs.exists(realPath, function (exists) {
        if (!exists) {
            //处理请求
            var handle = findHandle(req,res,pathname);
            try{
                if(handle instanceof Array){
                    var h = handle.shift();
                    h.apply(this,[req,res,handle]);
                }else if(handle instanceof Object){
                    handle.apply(this,[req,res]);
                }else{
                    on404(req,res,pathname);
                }
            }catch(ex){
                logger.error(ex);
                on500(req,res,pathname);
            }
        } else {
            //处理静态资源
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    on500(req,res,pathname);
                } else {
                    var contentType = mine.types[ext] || "text/plain";
                    res.writeHead(200, {
                        'Content-Type': contentType
                    });
                    res.write(file, "binary");
                    res.end();
                }
            });
        }
    });





}

/**
 * 查询处理handle
 * 逻辑：按照url的pathname查询，例如/aaa/bbb/ccc
 * 可理解为三种情况（优先级如下）
 * 1.aaa/bbb/ccc模块的默认方法（如果没有默认方法则调用index方法）
 * 2.aaa/bbb模块中的ccc()方法
 * 3.aaa/bbb模块默认方法传入ccc参数
 * 3.aaa模块中bbb()方法,将ccc作为第一个参数传入
 * 4.静态资源
 * @param paths
 */
function findHandle(req,res,pathname){
    var handle = null;

    try{
        handle = require('.'+pathname);
        if(handle instanceof Function){
            return handle;
        }else{
            return handle['index'];
        }
    }catch(ex){
        logger.debug('无法找到 .'+pathname+'路径');
        on404(req,res,pathname);
    }

    var paths = pathname.split('/');
    var path = paths.pop();
        //第二种情况
        try{
            handle = require('.'+paths.join('/'));
            if(handle[path]){
                return handle[path];
            }else{
                logger.debug('无法找到 ./'+paths.join('/')+'的'+path+'方法');
                on404(req,res,pathname);
            }
            //判断handle是否为默认方法
            if(handle instanceof Function){
                return [handle,path];
            }else{
                logger.debug('无法找到 ./'+paths.join('/')+'的默认方法方法');
                on404(req,res,pathname);
            }
        }catch(ex){
            logger.debug('无法找到 ./'+paths.join('/')+'模块');
            on404(req,res,pathname);
        }
        //第三种情况
        var method = paths.pop();
        try{
            handle = require('.'+paths.join('/'));
            if(handle)
            if(handle[method]){
                return [handle[method],path];
            }else{
                logger.debug('无法找到 ./'+paths.join('/')+'的'+method+'方法');
                on404(req,res,pathname);
            }

        }catch(ex){
            logger.debug('无法找到 ./'+paths.join('/')+'模块');
            on404(req,res,pathname);
        }
        return handle;
}

function on404(req,res,pathname){
    logger.info('找不到路径');
    res.writeHead(404,"not found",{'Content-Type':'text/plain'});
    res.write("the request "+pathname+" is not found");
    res.end();
}

function on500(req,res,pathname){
    logger.error('逻辑错误');
    res.writeHead(500,"服务错误",{'Content-Type':'text/plain'});
    res.write("the request "+pathname+" service is error");
    res.end();
}