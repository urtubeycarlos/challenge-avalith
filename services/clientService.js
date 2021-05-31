const mySQLDB = require('../mysql.db');
const { checkValidDateTime, formatDateTimeToMySQL, checkValidDay } = require('../utils/datetime');

function addVisit({ clientId, day, dateTime }) {
    checkValidDay(day);
    checkValidDateTime(dateTime);
    return new Promise((resolve, reject) => {
        const db = mySQLDB();
        const query = 'insert into client_visit (clientId, visit_day, visit_datetime) values (?, ?, ?)';
        const values = [clientId, day, formatDateTimeToMySQL(dateTime)];
        db.query(query, values, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

module.exports = {
    addVisit,
};
