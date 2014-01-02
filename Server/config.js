/**
 * Created by sunharuka on 13-10-29.
 */
module.exports = {
    MODE: 'dev',
    LOG_LEVEL:'DEBUG',
    LISTEN_PORT: 3000,
    REDIS: {
        HOST: 'localhost',
        PORT: 6379
    },
    MYSQL:{
        HOST:'localhost',
        USERNAME:'root',
        PASSWORD:'',
        DATABASE: 'timepill'
    }
};