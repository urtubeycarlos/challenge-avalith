function checkID(id) {
    if (!id) {
        const error = new Error('Id must be defined');
        error.code = 'ER_NOT_ID';
        throw error;
    }
    const casted = Number.parseInt(id, 10);
    if (!(Number.isInteger(casted))) {
        const error = new Error('Id must be a integer');
        error.code = 'ER_ID_NOT_INT';
        throw error;
    }
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
        throw error;
    }
}

module.exports = {
    checkID,
    checkParams,
};
