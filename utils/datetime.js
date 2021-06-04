const moment = require('moment');

function checkValidDay(day) {
    if (day < 1 || day > 7) {
        const error = new Error('Invalid day');
        error.code = 'ER_BAD_DAY';
        throw error;
    }
    return day;
}

function checkValidDate(date) {
    const formats = ['DD/MM/YYYY', 'DD-MM-YYYY'];
    const valid = moment(date, formats).isValid();
    if (!valid) {
        const error = new Error('Invalid date');
        error.code = 'ER_BAD_DATE';
        throw error;
    }
    return valid;
}

function checkValidDateTime(dateTime) {
    const formats = ['DD/MM/YYYY HH:mm:ss', 'DD-MM-YYYY HH:mm:ss'];
    const valid = moment(dateTime, formats).isValid();
    if (!valid) {
        const error = new Error('Invalid datetime');
        error.code = 'ER_BAD_DATETIME';
        throw error;
    }
    return valid;
}

function checkValidTime(time) {
    const format = 'HH:mm:ss';
    const valid = moment(time, format).isValid();
    if (!valid) {
        const error = new Error('Invalid time');
        error.code = 'ER_BAD_TIME';
        throw error;
    }
    return valid;
}

function formatDateToMySQL(date) {
    const momentDate = moment(date, 'DD-MM-YYYY');
    const formated = momentDate.format('YYYY-MM-DD');
    return formated.toString();
}

function formatDateTimeToMySQL(dateTime) {
    const momentDateTime = moment(dateTime, 'DD-MM-YYYY HH:mm:ss');
    const formated = momentDateTime.format('YYYY-MM-DD HH:mm:ss');
    return formated.toString();
}

function formatDateTimeToUser(dateTime) {
    const momentDateTime = moment(dateTime, 'YYYY-MM-DD HH:mm:ss');
    const formated = momentDateTime.format('DD-MM-YYYY HH:mm:ss');
    return formated.toString();
}

module.exports = {
    checkValidDay,
    checkValidDate,
    checkValidTime,
    checkValidDateTime,
    formatDateToMySQL,
    formatDateTimeToMySQL,
    formatDateTimeToUser,
};
