const jwt = require('jsonwebtoken');
const md5 = require('md5');
const mySQLDB = require('../mysql.db');
const { checkParams, checkBlankParams } = require('../utils/checkers');
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

function update({ email, password, newEmail, newPassword, newName, newSurname, newRole }) {
    checkParams(email, password);
    checkBlankParams(email, password, newPassword, newName, newSurname, newRole);
    if (newPassword) {
        checkBlankParams(newPassword);
    }
    if (newName) {
        checkBlankParams(newName);
    }
    if (newSurname) {
        checkBlankParams(newSurname);
    }
    if (newRole) {
        checkBlankParams(newRole);
    }
    return new Promise((resolve, reject) => {
        const newEmailQuery = (newEmail) ? `, email = ${newEmail}` : '';
        const newPasswordQuery = (newPassword) ? `, password = ${md5(newPassword)}` : '';
        const newNameQuery = (newName) ? `, name = ${newName}` : '';
        const newSurnameQuery = (newSurname) ? `, surname = ${newSurname}` : '';
        const newRoleQuery = (newRole) ? `, role = ${newRole}` : '';
        const query = `update user set active = 1${newEmailQuery}${newPasswordQuery}${newNameQuery}${newSurnameQuery}${newRoleQuery} where email = ? and password = ?`;
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
                    const obj = { email, password, newPassword: password, newRole: role };
                    return resolve(update(obj));
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
