var mysql = require('mysql');

var pool  = mysql.createPool({
    user: 'wulab',
    password: 'ytwu35415',
    port: 3306,
    host: '140.115.126.19',
    database: 'inquiry', 
    waitForConnections : true, 
    connectionLimit : 1000       
});
0
module.exports = pool;