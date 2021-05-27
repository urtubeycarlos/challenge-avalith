const mySQLDB = require('../mysql.db');
const { checkParams, checkID } = require('../utils/checkers');

function getAll() {
    return new Promise((resolve, reject) => {
        const query = 'select id, name, brand, type, model, status from equipment';
        mySQLDB.query(query, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
        mySQLDB.end();
    });
}

function get(id) {
    checkID(id);
    return new Promise((resolve, reject) => {
        const query = 'select id, name, brand, type, model, status from equipment where id = ?';
        mySQLDB.query(query, id, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
        mySQLDB.end();
    });
}

function insert({ name, brand, type, model }) {
    checkParams(name, brand, type, model);
    return new Promise((resolve, reject) => {
        const query = 'insert into equipment (name, brand, type, model) values (?, ?, ?, ?)';
        const values = [name, brand, type, model];
        mySQLDB.query(query, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
        mySQLDB.end();
    });
}

function update(id, status) {
    checkID(id);
    checkParams(status);
    return new Promise((resolve, reject) => {
        const query = 'update equipment set status = ? where id = ?';
        const values = [status, id];
        mySQLDB.query(query, values, (error, result) => {
            mySQLDB.end();
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
        mySQLDB.end();
    });
}

function remove(id) {
    checkID(id);
    return new Promise((resolve, reject) => {
        const query = 'delete from equipment where id = ?';
        mySQLDB.query(query, id, (error, result) => {
            mySQLDB.end();
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
        mySQLDB.end();
    });
}

module.exports = {
    getAll,
    get,
    insert,
    update,
    remove,
};
