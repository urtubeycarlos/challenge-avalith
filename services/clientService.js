const mySQLDB = require('../mysql.db');
const { checkParams, checkID } = require('../utils/checkers');
const { checkValidDateTime, formatDateTimeToMySQL, checkValidDay, formatDateTimeToUser } = require('../utils/datetime');

function getAll() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT id, name, surname, email, password, role FROM user WHERE role = "client" AND active <> 0';
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
        const query = 'SELECT id, name, surname, email, password, role FROM user WHERE email = ? AND password = ? AND role = "client" AND active <> 0';
        const values = [email, password];
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

function getAllVisits() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT clientId, visitDay, visitDateTime FROM client_visit';
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
        const query = 'SELECT clientId, visitDay, visitDateTime FROM client_visit WHERE clientId = ?';
        const db = mySQLDB();
        db.query(query, clientId, (error, results) => {
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

function addVisit({ clientId, visitDay, visitDateTime }) {
    checkID(clientId);
    checkParams(visitDay, visitDateTime);
    checkValidDay(visitDay);
    checkValidDateTime(visitDateTime);
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO client_visit (clientId, visitDay, visitDateTime) VALUES (?, ?, ?)';
        const values = [clientId, visitDay, formatDateTimeToMySQL(visitDateTime)];
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

function removeVisit({ clientId, visitDay, visitDateTime }) {
    checkID(clientId);
    checkParams(visitDay, visitDateTime);
    checkValidDay(visitDay);
    checkValidDateTime(visitDateTime);
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM client_visit WHERE clientId = ? AND visitDay = ? AND visitDateTime = ?';
        const values = [clientId, visitDay, formatDateTimeToMySQL(visitDateTime)];
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
    getAllVisits,
    getClientVisits,
    addVisit,
    removeVisit,
};
