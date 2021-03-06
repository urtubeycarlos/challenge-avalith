const jwt = require('jsonwebtoken');
require('dotenv').config();

function decodeToken(req, res, next) {
    const token = req.headers.authorization;
    if (token) {
        return jwt.verify(token, process.env.TOKEN_KEY, (error, decoded) => {
            req.token = decoded;
            return next();
        });
    }
    return next();
}

function checkAuthorization(...rolesRequired) {
    if (!rolesRequired || !rolesRequired.length) {
        const error = 'rolesRequired cant be null or undefined or empty';
        error.code = 'ER_NOT_ROLE';
        throw error;
    }
    return (req, res, next) => {
        if (req.token) {
            const isValid = rolesRequired.includes(req.token.role);
            if (isValid) {
                return next();
            }
        }
        return res.sendStatus(401);
    };
}

function checkIDs(req, res, next) {
    if (req.token.role === 'admin') {
        return next();
    }
    if (Number.parseInt(req.params.id, 10) === req.token.id) {
        return next();
    }
    return res.sendStatus(401);
}

module.exports = {
    decodeToken,
    checkAuthorization,
    checkIDs,
};
