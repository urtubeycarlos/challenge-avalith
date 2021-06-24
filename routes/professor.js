const express = require('express');
const { checkAuthorization } = require('../middlewares/authentication');
const professorService = require('../services/professorService');

const router = express.Router();

router.get('/', checkAuthorization('admin'), async (req, res) => {
    try {
        const result = await professorService.getAll();
        return res.status(200).send(result);
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.get('/:id', checkAuthorization('admin'), async (req, res) => {
    try {
        const result = await professorService.get(req.params.id);
        return res.status(200).send(result);
    } catch (error) {
        if (error.code === 'ER_NOT_ID') {
            return res.status(400).send({ errorCode: error.code, msg: 'Id cant be null' });
        }
        if (error.code === 'ER_ID_NOT_INT') {
            return res.status(400).send({ errorCode: error.code, msg: 'Id must be an integer' });
        }
        return res.sendStatus(500);
    }
});

router.get('/schedule', checkAuthorization('client', 'admin'), async (req, res) => {
    try {
        const result = await professorService.getSchedules();
        return res.status(200).send(result);
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.get('/schedule/:id', checkAuthorization('client', 'admin'), async (req, res) => {
    try {
        const result = await professorService.getSchedule(req.params.id);
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

router.post('/schedule', checkAuthorization('admin'), async (req, res) => {
    try {
        await professorService.addSchedule(req.body);
        return res.status(200).send({ added: true, msg: 'schedule added successfully' });
    } catch (error) {
        if (error.code === 'ER_NOT_ID') {
            return res.status(400).send({ added: false, errorCode: error.code, msg: 'professorId cant be null' });
        }
        if (error.code === 'ER_ID_NOT_INT') {
            return res.status(400).send({ added: false, errorCode: error.code, msg: 'professorId must be an integer' });
        }
        if (error.code === 'ER_NOT_PARAM') {
            return res.status(400).send({ added: false, errorCode: error.code, msg: 'Missing param(s)' });
        }
        if (error.code === 'ER_BAD_DAY') {
            return res.status(400).send({ added: false, errorCode: error.code, msg: 'day must be an integer between 1 and 7' });
        }
        if (error.code === 'ER_BAD_TIME') {
            return res.status(400).send({ added: false, errorCode: error.code, msg: 'time must be formmated hh:mm:ss' });
        }
        return res.sendStatus(500);
    }
});

router.delete('/schedule', checkAuthorization('admin'), async (req, res) => {
    try {
        await professorService.removeSchedule(req.body);
        return res.status(200).send({ deleted: true, msg: 'schedule deleted successfully' });
    } catch (error) {
        if (error.code === 'ER_NOT_ID') {
            return res.status(400).send({ added: false, errorCode: error.code, msg: 'professorId cant be null' });
        }
        if (error.code === 'ER_ID_NOT_INT') {
            return res.status(400).send({ added: false, errorCode: error.code, msg: 'professorId must be an integer' });
        }
        if (error.code === 'ER_NOT_PARAM') {
            return res.status(400).send({ added: false, errorCode: error.code, msg: 'Missing param(s)' });
        }
        if (error.code === 'ER_BAD_DAY') {
            return res.status(400).send({ added: false, errorCode: error.code, msg: 'day must be an integer between 1 and 7' });
        }
        if (error.code === 'ER_BAD_TIME') {
            return res.status(400).send({ added: false, errorCode: error.code, msg: 'time must be formmated hh:mm:ss' });
        }
        return res.sendStatus(500);
    }
});

module.exports = router;
