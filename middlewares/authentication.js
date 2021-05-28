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

function checkRole(roleRequired) {
    return (req, res, next) => {
        const isValid = req.token.role === roleRequired;
        if (isValid) {
            return next();
        }
        return res.sendStatus(403);
    };
}

module.exports = {
    checkToken,
    checkRole,
};
