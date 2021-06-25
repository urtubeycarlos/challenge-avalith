const express = require('express');
const routineService = require('../services/routineService');
const { checkAuthorization } = require('../middlewares/authentication');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const result = await routineService.getAll();
        return res.status(200).send(result);
    } catch (error) {
        error.action = 'get';
        res.locals.error = error;
        return next();
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const result = await routineService.get(req.params.id);
        return res.status(200).send(result);
    } catch (error) {
        error.action = 'get';
        res.locals.error = error;
        return next();
    }
});

router.post('/', checkAuthorization('professor', 'admin'), async (req, res, next) => {
    try {
        await routineService.insert(req.body);
        return res.status(200).send({ added: true, msg: 'routine added successfully' });
    } catch (error) {
        error.action = 'added';
        res.locals.error = error;
        return next();
    }
});

router.put('/', checkAuthorization('professor', 'admin'), async (req, res, next) => {
    try {
        await routineService.update(req.body);
        return res.status(200).send({ updated: true, msg: 'routine updated successfully' });
    } catch (error) {
        error.action = 'updated';
        res.locals.error = error;
        return next();
    }
});

router.delete('/:id', checkAuthorization('professor', 'admin'), async (req, res, next) => {
    try {
        const result = await routineService.remove(req.params.id);
        if (!result.result.n) {
            return res.status(400).send({ deleted: false, errorCode: 'ER_NOT_EXISTS', msg: 'routine not exists for passed id' });
        }
        return res.status(200).send({ deleted: true, msg: 'routine deleted successfully' });
    } catch (error) {
        error.action = 'deleted';
        res.locals.error = error;
        return next();
    }
});

module.exports = router;
