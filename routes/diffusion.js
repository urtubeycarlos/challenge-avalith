const express = require('express');
const { checkAuthorization } = require('../middlewares/authentication');
const emailService = require('../services/emailService');
const userService = require('../services/userService');

const router = express.Router();

router.post('/', checkAuthorization('admin'), async (req, res, next) => {
    let clients;
    try {
        clients = await userService.getAll('client');
        clients = clients.map((client) => client.email);
        req.body.recipients = clients;
    } catch (error) {
        error.action = 'send email';
        res.locals.error = error;
        return next();
    }

    try {
        const result = await emailService.sendMail(req.body);
        return res.send(result);
    } catch (error) {
        error.action = 'send email';
        res.locals.error = error;
        return next();
    }
});

module.exports = router;
