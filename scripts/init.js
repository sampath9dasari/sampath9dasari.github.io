/* Create db
 * Team pclubGU
 * The MIT License
 */

var mysql = require('mysql');
var conf = require('./config').conn;
var conn = mysql.createConnection(conf.connection);

conn.query('CREATE DATABASE ' + conf.database);

conn.query('\
CREATE TABLE `' + conf.database + '`.`' + conf.users_table + '` ( \
        `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
        `username` VARCHAR(255) NOT NULL, \
        `password` VARCHAR(60) NOT NULL, \
        `email` VARCHAR(255) NOT NULL, \
        `active` VARCHAR(255) NOT NULL, \
        `resetToken` VARCHAR(255) DEFAULT NULL, \
        `resetComplete` VARCHAR(3) DEFAULT "No", \
        PRIMARY KEY (`id`), \
        UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
        UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
)');

console.log('[LOGINFO] Database created');

conn.end();
