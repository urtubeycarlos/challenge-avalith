const mySQLDB = require('../mysql.db');
const { checkID, checkParams } = require('../utils/checkers');
const { checkValidDay, checkValidTime } = require('../utils/datetime');

function getAll() {
    return new Promise((resolve, reject) => {
        const query = 'select id, name, surname, email, password, role from user where role = "professor" and active <> 0';
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

function get(professorId) {
    checkID(professorId);
    return new Promise((resolve, reject) => {
        const query = 'select id, name, surname, email, password, role from user where id = ? and role = "client" and active <> 0';
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

function getSchedules() {
    return new Promise((resolve, reject) => {
        const query = 'select professorId, day, startHour, finishHour from professor_schedule';
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
        const query = 'select professorId, day, startHour, finishHour from professor_schedule where professorId = ?';
        const values = [professorId];
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

function addSchedule({ professorId, day, startHour, finishHour }) {
    checkID(professorId);
    checkParams(day, startHour, finishHour);
    checkValidDay(day);
    checkValidTime(startHour);
    checkValidTime(finishHour);
    return new Promise((resolve, reject) => {
        const query = 'insert into professor_schedule (professorId, day, startHour, finishHour) values (?, ?, ?, ?)';
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
        const query = 'delete from professor_schedule where professorID = ? and day = ? and startHour = ? and finishHour = ?';
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
};
