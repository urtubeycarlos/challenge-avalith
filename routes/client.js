const express = require('express');
const clientService = require('../services/clientService');
const { checkAuthorization } = require('../middlewares/authentication');

const router = express.Router();

router.get('/', checkAuthorization('admin'), async (req, res) => {
    try {
        const result = await clientService.getAll();
        return res.status(200).send(result);
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.get('/:id', checkAuthorization('admin'), async (req, res) => {
    try {
        const result = await clientService.get(req.params.id);
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

router.get('/visits', checkAuthorization('professor', 'admin'), async (req, res) => {
    try {
        const result = await clientService.getAllVisits();
        return res.status(200).send(result);
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.get('/visits/:id', checkAuthorization('professor', 'admin'), async (req, res) => {
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

router.post('/visits', checkAuthorization('professor', 'admin'), async (req, res) => {
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
