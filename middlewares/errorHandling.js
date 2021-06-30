function resolveError(req, res, next) {
    const { error } = res.locals;
    if (!error) {
        return next();
    }
    const result = {};
    result[error.action] = false; // false porque es una acción que no se pudo completar
    result.errorCode = error.code;
    if (!error.status) {
        error.status = 500; // si llega sin algun status 400 es porque es un error interno
    }
    return res.status(error.status).send(result);
}

module.exports = {
    resolveError,
};
