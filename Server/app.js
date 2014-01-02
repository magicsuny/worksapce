/**
 * Created by sunharuka on 13-10-29.
 */


var log4js = require('log4js'),
    config = require('./config');
/**
 * 获取日志logger
 * @param name
 * @returns {Logger}
 */
exports.getLogger = function(name){
    var logger = log4js.getLogger(name);
    logger.setLevel(config.LOG_LEVEL);
    return logger;
}

/**
 * 获取配置文件
 * @returns {*|exports}
 */
exports.getConfig = function(){
    return config;
}
var server = require('./server');

//日志配置
log4js.configure({
    appenders:[{ type: 'console' },{
        type:'dateFile',
        pattern: "-yyyy-MM-dd",
        filename:'./logs/server.log',
        category:['sys','router']
    }],
    replaceConsole:true
});
exports.server = server.start();