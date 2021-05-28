const mySQL = require('mysql');
require('dotenv').config();

const {
    MYSQL_HOST,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DB,
} = process.env;

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
