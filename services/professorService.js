const mySQLDB = require('../mysql.db');
const { checkID, checkParams } = require('../utils/checkers');
const { checkValidDay, checkValidTime } = require('../utils/datetime');

function getAll() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT id, name, surname, email, password, role FROM user WHERE role = "professor" AND active <> 0';
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
        const query = 'SELECT id, name, surname, email, password, role FROM user WHERE email = ? AND password = ? AND role = "professor" AND active <> 0';
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

function getSchedules() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT ps.professorId, p.name, p.surname, ps.day, ps.startHour, ps.finishHour FROM professor_schedule AS ps JOIN user AS p ON ps.professorId = p.id';
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

function getSchedule(professorId) {
    checkID(professorId);
    return new Promise((resolve, reject) => {
        const query = 'SELECT ps.professorId, p.name, p.surname, ps.day, ps.startHour, ps.finishHour FROM professor_schedule AS ps JOIN user AS p ON ps.professorId = p.id AND ps.professorId = ?';
        const db = mySQLDB();
        db.query(query, professorId, (error, result) => {
            db.end();
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

function addSchedule({ professorId, day, startHour, finishHour }) {
    checkID(professorId);
    checkParams(day, startHour, finishHour);
    checkValidDay(day);
    checkValidTime(startHour);
    checkValidTime(finishHour);
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO professor_schedule (professorId, day, startHour, finishHour) VALUES (?, ?, ?, ?)';
        const values = [professorId, day, startHour, finishHour];
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

function removeSchedule({ professorId, day, startHour, finishHour }) {
    checkID(professorId);
    checkParams(day, startHour, finishHour);
    checkValidDay(day);
    checkValidTime(startHour);
    checkValidTime(finishHour);
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM professor_schedule WHERE professorID = ? AND day = ? AND startHour = ? AND finishHour = ?';
        const values = [professorId, day, startHour, finishHour];
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
    getSchedules,
    getSchedule,
    addSchedule,
    removeSchedule,
};
