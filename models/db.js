var mysql = require('mysql');
var host = process.env.MARIADB.HOST
var user = process.env.MARIADB_USER
var password = process.env.MARIADB_PASSWORD
var database = process.env.MARIADB_DB

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
