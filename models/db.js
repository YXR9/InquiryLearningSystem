var mysql = require('mysql');
var host = process.env.DB_HOST_URL || "140.115.126.19"
var user = process.env.DB_USER_ACCOUNT || "wulab"
var password = process.env.DB_USER_PASSWORD || "ytwu35415"
var database = process.env.MYSQL_DATABASE || "inquiry"

var pool  = mysql.createPool({
    user: user,
    password: password,
    port: 3306,
    host: host,
    database: database, 
    waitForConnections : true, 
    connectionLimit : 1000       
});

module.exports = pool;
