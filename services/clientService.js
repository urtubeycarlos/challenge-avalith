const mySQLDB = require('../mysql.db');
const { checkParams, checkID } = require('../utils/checkers');
const { checkValidDateTime, formatDateTimeToMySQL, checkValidDay } = require('../utils/datetime');

function getClient(clientId) {
    checkID(clientId);
    return new Promise((resolve, reject) => {
        const query = 'select id, name, surname, email, password, role from user where id = ? and role = "client" and active <> 0';
        const values = [clientId];
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

function getClients() {
    return new Promise((resolve, reject) => {
        const query = 'select id, name, surname, email, password, role from user where role = "client" and active <> 0';
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

function getVisits() {
    return new Promise((resolve, reject) => {
        const query = 'select clientId, visit_day, visit_date from client_visit';
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

function getClientVisits(clientId) {
    checkID(clientId);
    return new Promise((resolve, reject) => {
        const query = 'select clientId, visit_day, visit_date from client_visit where clientId = ?';
        const values = [clientId];
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

function addVisit({ clientId, day, dateTime }) {
    checkID(clientId);
    checkParams(day, dateTime);
    checkValidDay(day);
    checkValidDateTime(dateTime);
    return new Promise((resolve, reject) => {
        const db = mySQLDB();
        const query = 'insert into client_visit (clientId, visit_day, visit_datetime) values (?, ?, ?)';
        const values = [clientId, day, formatDateTimeToMySQL(dateTime)];
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
    getClient,
    getClients,
    getVisits,
    getClientVisits,
    addVisit,
};
