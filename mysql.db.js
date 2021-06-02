const mySQL = require('mysql');
require('dotenv').config();

let env = process.env.NODE_ENV;

let MYSQL_HOST;
let MYSQL_USER;
let MYSQL_PASSWORD;
let MYSQL_DB;

console.log(env);

if (env) {
    env = env.toUpperCase();
    MYSQL_HOST = process.env[`MYSQL_HOST_${env}`];
    MYSQL_USER = process.env[`MYSQL_USER_${env}`];
    MYSQL_PASSWORD = process.env[`MYSQL_PASSWORD_${env}`];
    MYSQL_DB = process.env[`MYSQL_DB_${env}`];
} else {
    MYSQL_HOST = process.env.MYSQL_HOST;
    MYSQL_USER = process.env.MYSQL_USER;
    MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
    MYSQL_DB = process.env.MYSQL_DB;
}

const config = {
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB,
};

function connection() {
    return mySQL.createPool(config);
}

module.exports = connection;
