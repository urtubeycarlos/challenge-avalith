const express = require('express');
const { checkAuthorization } = require('../middlewares/authentication');
const schedulesService = require('../services/schedulesService');

const router = express.Router();

/* router.get('/', checkAuthorization('admin'), async (req, res) => {
    try {
        const result = await schedulesService.getAll();
        return res.status(200).send(result);
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.get('/:id', checkAuthorization('admin'), async (req, res) => {
    try {
        const result = await schedulesService.get(req.params.id);
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
}); */

router.get('/', checkAuthorization('client', 'admin'), async (req, res, next) => {
    try {
        const result = await schedulesService.getSchedules();
        return res.status(200).send(result);
    } catch (error) {
        error.action = 'get';
        res.locals.error = error;
        return next();
    }
});

router.get('/:id', checkAuthorization('client', 'admin'), async (req, res, next) => {
    try {
        const result = await schedulesService.getSchedule(req.params.id);
        return res.status(200).send(result);
    } catch (error) {
        error.action = 'get';
        res.locals.error = error;
        return next();
    }
});

router.post('/', checkAuthorization('admin'), async (req, res, next) => {
    try {
        await schedulesService.addSchedule(req.body);
        return res.status(200).send({ added: true, msg: 'schedule added successfully' });
    } catch (error) {
        error.action = 'added';
        res.locals.error = error;
        return next();
    }
});

router.delete('/', checkAuthorization('admin'), async (req, res, next) => {
    try {
        await schedulesService.removeSchedule(req.body);
        return res.status(200).send({ deleted: true, msg: 'schedule deleted successfully' });
    } catch (error) {
        error.action = 'deleted';
        res.locals.error = error;
        return next();
    }
});

module.exports = router;
