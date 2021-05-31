const jwt = require('jsonwebtoken');
const md5 = require('md5');
const mySQLDB = require('../mysql.db');
const { checkParams } = require('../utils/checkers');
require('dotenv').config();

function getAll() {
    return new Promise((resolve, reject) => {
        const query = 'select id, name, surname, email, password, role from user where active <> 0';
        const db = mySQLDB();
        db.query(query, (error, result) => {
            db.end();
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

function get({ email, password }) {
    checkParams(email, password);
    return new Promise((resolve, reject) => {
        const query = 'select id, name, surname, email, password, role from user where email = ? and password = ? and active <> 0';
        const values = [email, md5(password)];
        const db = mySQLDB();
        db.query(query, values, (error, result) => {
            db.end();
            if (error) {
                return reject(error);
            }
            return resolve((result[0] === undefined) ? {} : result[0]);
        });
    });
}

function update({ email, password, newPassword, role }) {
    checkParams(email, password, newPassword);
    if (newPassword === '') {
        const error = new Error('new password cant be blank');
        error.code = 'ER_BLANK_NPASSWORD';
        throw error;
    }
    return new Promise((resolve, reject) => {
        const newRole = (role) ? `, role = ${role}` : '';
        const query = `update user set password = ?, active = 1${newRole} where email = ? and password = ?`;
        const values = [md5(newPassword), email, md5(password)];
        const db = mySQLDB();
        db.query(query, values, (error, result) => {
            db.end();
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

function insert({ name, surname, email, password, role }) {
    checkParams(name, surname, email, password, role);
    return new Promise((resolve, reject) => {
        const query = 'insert into user (name, surname, email, password, role) values (?, ?, ?, ?, ?)';
        const values = [name, surname, email, md5(password), role];
        const db = mySQLDB();
        db.query(query, values, (error, result) => {
            db.end();
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    return resolve(update({ email, password, newPassword: password }));
                }
                return reject(error);
            }
            return resolve(result);
        });
    });
}

function remove({ email, password }) {
    checkParams(email, password);
    return new Promise((resolve, reject) => {
        const query = 'update user set active = 0 where email = ? and password = ?';
        const values = [email, md5(password)];
        const db = mySQLDB();
        db.query(query, values, (error, result) => {
            db.end();
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

function createToken(user, expiresIn) {
    if (!user || Object.keys(user).length === 0) {
        const error = new Error('Not user passed as parameter');
        error.code = 'ER_NOT_USER';
        throw error;
    }
    const options = {
        algorithm: process.env.TOKEN_ALGORITHM,
        expiresIn,
    };
    const payload = JSON.parse(JSON.stringify(user));
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.TOKEN_KEY, options, (encodeError, encoded) => {
            if (encodeError) {
                return reject(encodeError);
            }
            return resolve(encoded);
        });
    });
}

module.exports = {
    getAll,
    get,
    insert,
    update,
    remove,
    createToken,
};
