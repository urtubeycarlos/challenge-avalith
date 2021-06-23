const md5 = require('md5');
const mySQLDB = require('../mysql.db');
const { checkParams, checkBlankParams } = require('../utils/checkers');
require('dotenv').config();

function getAll(...roles) {
    return new Promise((resolve, reject) => {
        let roleQuery = '';
        if (roles.length) {
            roleQuery = ' AND (';
            for (let i = 0; i < roles.length; i += 1) {
                const role = roles[i];
                roleQuery += `role = ${role}`;
                if (i !== roles.length) {
                    roleQuery += ' OR ';
                }
            }
            roleQuery += ')';
        }
        const query = `SELECT id, name, surname, email, password, role FROM user WHERE active <> 0${roleQuery}`;
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

function get({ id, email, password }) {
    checkParams(email, password);
    return new Promise((resolve, reject) => {
        let query;
        let values;
        if (id) {
            query = 'SELECT id, name, surname, email, password, role FROM user WHERE id = ? AND active <> 0';
            values = [id];
        } else {
            query = 'SELECT id, name, surname, email, password, role FROM user WHERE email = ? AND password = ? AND active <> 0';
            values = [email, md5(password)];
        }
        const db = mySQLDB();
        db.query(query, values, (error, result) => {
            db.end();
            if (error) {
                return reject(error);
            }
            return resolve((!result[0]) ? {} : result[0]);
        });
    });
}

function update({ email, password, newEmail, newPassword, newName, newSurname, newRole }) {
    checkParams(email, password);
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
        const newEmailQuery = (newEmail) ? `, email = '${newEmail}'` : '';
        const newPasswordQuery = (newPassword) ? `, password = '${md5(newPassword)}'` : '';
        const newNameQuery = (newName) ? `, name = '${newName}'` : '';
        const newSurnameQuery = (newSurname) ? `, surname = '${newSurname}'` : '';
        const newRoleQuery = (newRole) ? `, role = ${newRole}` : '';
        const query = `UPDATE user SET active = 1${newEmailQuery}${newPasswordQuery}${newNameQuery}${newSurnameQuery}${newRoleQuery} WHERE email = ? AND password = ?`;
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
        const query = 'INSERT INTO user (name, surname, email, password, role) VALUES (?, ?, ?, ?, ?)';
        const values = [name, surname, email, md5(password), role];
        const db = mySQLDB();
        db.query(query, values, (error, result) => {
            db.end();
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    const obj = {
                        email,
                        password,
                        newName: name,
                        newSurname: surname,
                        newPassword: password,
                        newRole: role,
                    };
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
        const query = 'UPDATE user SET active = 0 WHERE email = ? AND password = ?';
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

module.exports = {
    getAll,
    get,
    insert,
    update,
    remove,
};
