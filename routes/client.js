const express = require('express');
const clientService = require('../services/clientService');
const { checkRole } = require('../middlewares/authentication');

const router = express.Router();

router.get('/', checkRole('admin'), async (req, res) => {
    try {
        const result = await clientService.getClients();
        return res.status(200).send(result);
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.get('/:id', checkRole('admin'), async (req, res) => {
    try {
        const result = await clientService.getClient(req.params.id);
        return res.status(200).send(result);
    } catch (error) {
        if (error.code === 'ER_NOT_ID') {
            return res.status(400).send({ errorCode: error.code, msg: 'id cant be null' });
        }
        if (error.code === 'ER_ID_NOT_INT') {
            return res.status(400).send({ errorCode: error.code, msg: 'id must be an integer' });
        }
        return res.sendStatus(500);
    }
});

router.get('/visits', checkRole('professor', 'admin'), async (req, res) => {
    try {
        const result = await clientService.getVisits();
        return res.status(200).send(result);
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.get('/visits/:id', checkRole('professor', 'admin'), async (req, res) => {
    try {
        const result = await clientService.getClientVisits(req.params.id);
        return res.status(200).send(result);
    } catch (error) {
        if (error.code === 'ER_NOT_ID') {
            return res.status(400).send({ errorCode: error.code, msg: 'id cant be null' });
        }
        if (error.code === 'ER_ID_NOT_INT') {
            return res.status(400).send({ errorCode: error.code, msg: 'id must be an integer' });
        }
        return res.sendStatus(500);
    }
});

router.post('/visits', checkRole('professor', 'admin'), async (req, res) => {
    try {
        await clientService.addVisit(req.body);
        return res.status(200).send({ added: true, msg: 'visit added successfully' });
    } catch (error) {
        if (error.code === 'ER_NOT_ID') {
            return res.status(400).send({ added: false, errorCode: error.code, msg: 'id cant be null' });
        }
        if (error.code === 'ER_ID_NOT_INT') {
            return res.status(400).send({ added: false, errorCode: error.code, msg: 'id must be an integer' });
        }
        if (error.code === 'ER_NOT_PARAM') {
            return res.status(400).send({ added: false, errorCode: error.code, msg: 'missing param(s)' });
        }
        if (error.code === 'ER_BAD_DAY') {
            return res.status(400).send({ added: false, errorCode: error.code, msg: 'day must be an integer between 1 and 7' });
        }
        if (error.code === 'ER_BAD_DATETIME') {
            return res.status(400).send({ added: false, errorCode: error.code, msg: 'dateTime must be formatted DD/MM/YYYY hh:mm:ss or DD-MM-YYYY hh:mm:ss' });
        }
        return res.sendStatus(500);
    }
});

module.exports = router;
