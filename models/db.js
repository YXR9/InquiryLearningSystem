var mysql = require('mysql');

var pool  = mysql.createPool({
    user: 'root',
    password: '',
    port: 3306,
    host: 'localhost',
    database: 'knowledge forum', 
    waitForConnections : true, 
    connectionLimit : 1000       
});
0
module.exports = pool;