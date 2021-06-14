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
        const result = await emailService.sendMail(req.body);
        return res.send(result);
    } catch (error) {
        if (error.code === 'ER_NOT_PARAM') {
            return res.status(400).send({ error: error.code, msg: 'missing param' });
        }
        return res.sendStatus(500);
    }
});

module.exports = router;
