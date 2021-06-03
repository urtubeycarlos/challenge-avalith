const mySQLDB = require('../mysql.db');
const { checkParams, checkID } = require('../utils/checkers');
const { checkValidDateTime, formatDateTimeToMySQL, checkValidDay, formatDateTimeToUser } = require('../utils/datetime');

function getAll() {
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

function get({ email, password }) {
    checkParams(email, password);
    return new Promise((resolve, reject) => {
        const query = 'select id, name, surname, email, password, role from user where email = ? and password = ? and role = "client" and active <> 0';
        const values = [email, password];
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

function getAllVisits() {
    return new Promise((resolve, reject) => {
        const query = 'select clientId, visitDay, visitDateTime from client_visit';
        const db = mySQLDB();
        db.query(query, (error, results) => {
            db.end();
            if (error) {
                return reject(error);
            }
            const formatedResults = results.map((result) => {
                const resultFormated = result;
                resultFormated.visitDateTime = formatDateTimeToUser(result.visitDateTime);
                return resultFormated;
            });
            return resolve(formatedResults);
        });
    });
}

function getClientVisits(clientId) {
    checkID(clientId);
    return new Promise((resolve, reject) => {
        const query = 'select clientId, visitDay, visitDateTime from client_visit where clientId = ?';
        const values = [clientId];
        const db = mySQLDB();
        db.query(query, values, (error, results) => {
            db.end();
            if (error) {
                return reject(error);
            }
            const formatedResults = results.map((result) => {
                const resultFormated = result;
                resultFormated.visitDateTime = formatDateTimeToUser(result.visitDateTime);
                return resultFormated;
            });
            return resolve(formatedResults);
        });
    });
}

function addVisit({ clientId, day, dateTime }) {
    checkID(clientId);
    checkParams(day, dateTime);
    checkValidDay(day);
    checkValidDateTime(dateTime);
    return new Promise((resolve, reject) => {
        const query = 'insert into client_visit (clientId, visitDay, visitDateTime) values (?, ?, ?)';
        const values = [clientId, day, formatDateTimeToMySQL(dateTime)];
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

function removeVisit({ clientId, day, dateTime }) {
    checkID(clientId);
    checkParams(day, dateTime);
    checkValidDay(day);
    checkValidDateTime(dateTime);
    return new Promise((resolve, reject) => {
        const query = 'delete from client_visit where clientId = ? and visitDay = ? and visitDateTime = ?';
        const values = [clientId, day, formatDateTimeToMySQL(dateTime)];
        const db = mySQLDB();
        db.query(query, values, (error, result) => {
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
    getAllVisits,
    getClientVisits,
    addVisit,
    removeVisit,
};
