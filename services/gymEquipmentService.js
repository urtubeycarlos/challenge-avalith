const mySQLDB = require('../mysql.db');
const { checkParams, checkID } = require('../utils/checkers');

function getAll() {
    return new Promise((resolve, reject) => {
        const query = 'select id, name, brand, type, model, status from equipment';
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

function get(id) {
    checkID(id);
    return new Promise((resolve, reject) => {
        const query = 'select id, name, brand, type, model, status from equipment where id = ?';
        const db = mySQLDB();
        db.query(query, id, (error, result) => {
            db.end();
            if (error) {
                return reject(error);
            }
            return resolve((!result[0]) ? {} : result[0]);
        });
    });
}

function insert({ name, brand, type, model }) {
    checkParams(name, brand, type, model);
    return new Promise((resolve, reject) => {
        const query = 'insert into equipment (name, brand, type, model) values (?, ?, ?, ?)';
        const values = [name, brand, type, model];
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

function update(id, status) {
    checkID(id);
    checkParams(status);
    if (status < 1 || status > 2) {
        const error = new Error();
        error.code = 'ER_BAD_STATUS';
        throw error;
    }
    return new Promise((resolve, reject) => {
        const query = 'update equipment set status = ? where id = ?';
        const values = [status, id];
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

function remove(id) {
    checkID(id);
    return new Promise((resolve, reject) => {
        const query = 'delete from equipment where id = ?';
        const db = mySQLDB();
        db.query(query, id, (error, result) => {
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
