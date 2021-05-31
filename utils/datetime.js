const moment = require('moment');

function checkValidDay(day) {
    if (day < 1 || day > 7) {
        const error = new Error('Invalid day.');
        error.code = 'ER_BAD_DAY';
        throw error;
    }
}

function checkValidDate(date) {
    const formats = ['DD/MM/YYYY', 'DD-MM-YYYY'];
    const valid = moment(date, formats, true).isValid();
    if (!valid) {
        const error = new Error('Invalid date');
        error.code = 'ER_BAD_DATE';
        throw error;
    }
}

function checkValidDateTime(dateTime) {
    const formats = ['DD/MM/YYYY hh:mm:ss', 'DD-MM-YYYY hh:mm:ss'];
    const valid = moment(dateTime, formats, true).isValid();
    if (!valid) {
        const error = new Error('Invalid date.');
        error.code = 'ER_BAD_DATE';
        throw error;
    }
}

function formatDateToMySQL(date) {
    const momentDate = moment(date, 'DD-MM-YYYY');
    const formated = momentDate.format('YYYY-MM-DD');
    return formated.toString();
}

function formatDateTimeToMySQL(dateTime) {
    const momentDateTime = moment(dateTime, 'DD-MM-YYYY hh:mm:ss');
    const formated = momentDateTime.format('YYYY-MM-DD hh:mm:ss');
    return formated.toString();
}

module.exports = {
    checkValidDay,
    checkValidDate,
    checkValidDateTime,
    formatDateToMySQL,
    formatDateTimeToMySQL,
};
