var mysql = require('mysql');
var dbconfig = require('./database');

var connection = mysql.createConnection(dbconfig.connection);

connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table + '` ( \
    `regname` VARCHAR(255) NOT NULL, \
    `regemail` VARCHAR(255) NOT NULL, \
    `regphone` INT(10) NOT NULL, \
    `regevent` VARCHAR(255) NOT NULL, \
    `regyear` VARCHAR(255) NOT NULL, \
    `regcollege` VARCHAR(255) NOT NULL, \
    PRIMARY KEY (`regname`) \
)');

console.log('Success: Database Created!')

connection.end();
