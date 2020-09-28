
// From any nodejs controller page con can be included using the require method. eg: var dbConn = require('./mysqlDbConfig');
// Everytime a require is called, a mysql object will be returned which is same across all controllers. So only one mysql con will exist. This is a feature of nodejs.

var mysql = require('mysql');

var con = mysql.createConnection({
    host: '192.168.75.27',
    user: 'root',
    password: 'root123',
    database: 'test'
});

con.connect(function (err) {
    if (!err) {
        console.log("Database is connected ...");
    } else {
        console.log("Error connecting database ...");
    }
});

module.exports = con;

/*
 //Following code is for pooled mysql connection
 
 var mysql = require('mysql');
 
 var pool = mysql.createPool({
 connectionLimit: 10,
 host: 'localhost',
 user: 'matt',
 password: 'password',
 database: 'my_database'
 })
 
 pool.getConnection((err, connection) => {
 if (err) {
 if (err.code === 'PROTOCOL_CONNECTION_LOST') {
 console.error('Database connection was closed.')
 }
 if (err.code === 'ER_CON_COUNT_ERROR') {
 console.error('Database has too many connections.')
 }
 if (err.code === 'ECONNREFUSED') {
 console.error('Database connection was refused.')
 }
 }
 
 if (connection) connection.release()
 return
 })
 
 module.exports = pool
 
 */