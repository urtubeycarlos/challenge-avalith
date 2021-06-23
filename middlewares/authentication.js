const jwt = require('jsonwebtoken');
require('dotenv').config();

function checkToken(req, res, next) {
    const token = req.headers.authorization;
    if (token) {
        return jwt.verify(token, process.env.TOKEN_KEY, (error, decoded) => {
            if (error) {
                return res.sendStatus(401);
            }
            req.token = decoded;
            return next();
        });
    }
    return res.sendStatus(401);
}

function checkRole(...rolesRequired) {
    if (!rolesRequired) {
        const error = 'rolesRequired cant be null or undefined';
        error.code = 'ER_NOT_ROLE';
        throw error;
    }
    return (req, res, next) => {
        const isValid = rolesRequired.includes(req.token.role);
        if (isValid) {
            return next();
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
    checkToken,
    checkRole,
    checkIDs,
};
