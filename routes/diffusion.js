const express = require('express');
const { checkRole } = require('../middlewares/authentication');
const emailService = require('../services/emailService');
const clientService = require('../services/clientService');

const router = express.Router();

router.post('/', checkRole('admin'), async (req, res) => {
    let clients;
    try {
        clients = await clientService.getAll();
        clients = clients.map((client) => client.email);
        req.body.recipients = clients;
    } catch (error) {
        return res.sendStatus(500);
    }

    try {
        await emailService.sendMail(req.body);
    } catch (error) {
        if (error.code === 'ER_NOT_PARAM') {
            return res.sendStatus(400);
        }
        return res.sendStatus(500);
    }
    return res.sendStatus(200);
});

module.exports = router;
