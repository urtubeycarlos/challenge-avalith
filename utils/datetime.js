const moment = require('moment');

function checkValidDay(day) {
    if (!day) {
        const error = new Error('Not day');
        error.code = 'ER_NOT_DAY';
        error.status = 400;
        throw error;
    }
    if (day < 1 || day > 7) {
        const error = new Error('Invalid day');
        error.code = 'ER_BAD_DAY';
        error.status = 400;
        throw error;
    }
    return day;
}

function checkValidDate(date) {
    if (!date) {
        const error = new Error('Not date');
        error.code = 'ER_NOT_DATE';
        error.status = 400;
        throw error;
    }
    const formats = ['DD/MM/YYYY', 'DD-MM-YYYY'];
    const valid = moment(date, formats).isValid();
    if (!valid) {
        const error = new Error('Invalid date');
        error.code = 'ER_BAD_DATE';
        error.status = 400;
        throw error;
    }
    return valid;
}

function checkValidDateTime(dateTime) {
    if (!dateTime) {
        const error = new Error('Not datetime');
        error.code = 'ER_NOT_DATETIME';
        error.status = 400;
        throw error;
    }
    const formats = ['DD/MM/YYYY HH:mm:ss', 'DD-MM-YYYY HH:mm:ss'];
    const valid = moment(dateTime, formats).isValid();
    if (!valid) {
        const error = new Error('Invalid datetime');
        error.code = 'ER_BAD_DATETIME';
        error.status = 400;
        throw error;
    }
    return valid;
}

function checkValidTime(time) {
    if (!time) {
        const error = new Error('Not time');
        error.code = 'ER_NOT_TIME';
        error.status = 400;
        throw error;
    }
    const format = 'HH:mm:ss';
    const valid = moment(time, format).isValid();
    if (!valid) {
        const error = new Error('Invalid time');
        error.code = 'ER_BAD_TIME';
        error.status = 400;
        throw error;
    }
    return valid;
}

function formatDateToMySQL(date) {
    checkValidDate(date);
    const momentDate = moment(date, 'DD-MM-YYYY');
    const formated = momentDate.format('YYYY-MM-DD');
    return formated.toString();
}

function formatDateTimeToMySQL(dateTime) {
    checkValidDateTime(dateTime);
    const momentDateTime = moment(dateTime, 'DD-MM-YYYY HH:mm:ss');
    const formated = momentDateTime.format('YYYY-MM-DD HH:mm:ss');
    return formated.toString();
}

function formatDateTimeToUser(dateTime) {
    if (!dateTime) {
        const error = new Error('Not datetime');
        error.code = 'ER_NOT_DATETIME';
        error.status = 400;
        throw error;
    }
    const formats = ['YYYY-MM-DD HH:mm:ss'];
    const valid = moment(dateTime, formats).isValid();
    if (!valid) {
        const error = new Error('Invalid datetime');
        error.code = 'ER_BAD_DATETIME';
        error.status = 400;
        throw error;
    }
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
