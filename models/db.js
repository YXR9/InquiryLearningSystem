var mysql = require('mysql');
var host = process.env.DB_HOST_URL || "localhost"
var user = process.env.DB_USER_ACCOUNT || "root"
var password = process.env.DB_USER_PASSWORD || "root"
var database = process.env.MYSQL_DATABASE || "adminPage"

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
