function checkID(id) {
    if (!id) {
        const error = new Error('Id must be defined');
        error.code = 'ER_NOT_ID';
        error.status = 400;
        throw error;
    }
    if (!(Number.isInteger(id))) {
        const error = new Error('Id must be a integer');
        error.code = 'ER_ID_NOT_INT';
        error.status = 400;
        throw error;
    }
    return id;
}

function checkParams(...params) {
    let notParam = false;
    for (let i = 0; i < params.length; i += 1) {
        const param = params[i];
        notParam = notParam || !param;
    }
    if (notParam) {
        const error = new Error('null or undefined parameter(s)');
        error.code = 'ER_NOT_PARAM';
        error.status = 400;
        throw error;
    }
    return params;
}

function checkBlankParams(...params) {
    let blankParam = false;
    for (let i = 0; i < params.length; i += 1) {
        const param = params[i];
        blankParam = blankParam || param === '';
    }
    if (blankParam) {
        const error = new Error('blank parameter(s)');
        error.code = 'ER_BLANK_PARAM';
        error.status = 400;
        throw error;
    }
    return params;
}

module.exports = {
    checkID,
    checkParams,
    checkBlankParams,
};
