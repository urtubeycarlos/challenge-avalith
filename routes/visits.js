const express = require('express');
const clientVisitsService = require('../services/visitsService');
const { checkAuthorization } = require('../middlewares/authentication');

const router = express.Router();

/* router.get('/', checkAuthorization('admin'), async (req, res) => {
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
}); */

router.get('/', checkAuthorization('professor', 'admin'), async (req, res, next) => {
    try {
        const result = await clientVisitsService.getAllVisits();
        return res.status(200).send(result);
    } catch (error) {
        error.action = 'get';
        res.locals.error = error;
        return next();
    }
});

router.get('/:id', checkAuthorization('professor', 'admin'), async (req, res, next) => {
    try {
        const result = await clientVisitsService.getClientVisits(req.params.id);
        return res.status(200).send(result);
    } catch (error) {
        error.action = 'get';
        res.locals.error = error;
        return next();
    }
});

router.post('/', checkAuthorization('professor', 'admin'), async (req, res, next) => {
    try {
        await clientVisitsService.addVisit(req.body);
        return res.status(200).send({ added: true, msg: 'visit added successfully' });
    } catch (error) {
        error.action = 'added';
        res.locals.error = error;
        return next();
    }
});

module.exports = router;
