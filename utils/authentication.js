const jwt = require('jsonwebtoken');

function createToken(user, expiresIn) {
    if (!user || !Object.keys(user).length) {
        const error = new Error('Not user passed as parameter');
        error.code = 'ER_NOT_USER';
        throw error;
    }
    const options = {
        algorithm: process.env.TOKEN_ALGORITHM,
        expiresIn,
    };
    const payload = JSON.parse(JSON.stringify(user));
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.TOKEN_KEY, options, (encodeError, encoded) => {
            if (encodeError) {
                return reject(encodeError);
            }
            return resolve(encoded);
        });
    });
}

module.exports = {
    createToken,
};
