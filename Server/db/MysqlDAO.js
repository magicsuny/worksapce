var mysql = require("mysql"),
    queues = require('mysql-queues'),
    config = require("../config");
    var pool  = mysql.createPool(config.MYSQL_CONFIG);

/**
 * 获取连接
  * @param callback 回调函数
 * @param needTransaction 是否需要事务控制
 */
exports.getConnection = function(callback,needTransaction){
    pool.getConnection(function(err, connection){
        if(err){
            console.error("获取数据库连接错误："+err);
            return false;
        }

        if(needTransaction){
            queues(connection, true);
            var trans = connection.startTransaction();
            trans.beginTransaction();
            callback(trans);
            trans.commit();
        }else{
            callback(connection);
        }
        connection.release();
    });
}

/**
 * 查询
 * @param sql
 * @param callback
 */
exports.query = function(sql,callback){
    pool.query(sql, function(err, rows, fields) {
        if (err){
            throw err;
        }
        console.debug('the query sql is: ', sql);
        callback(rows,fields);
    });
}


