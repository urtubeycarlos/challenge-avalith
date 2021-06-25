const express = require('express');
const gymEquipmentService = require('../services/gymEquipmentService');
const { checkAuthorization } = require('../middlewares/authentication');

const router = express.Router();

router.get('/', checkAuthorization('admin', 'professor'), async (req, res, next) => {
    try {
        const result = await gymEquipmentService.getAll();
        return res.status(200).send(result);
    } catch (error) {
        error.action = 'get';
        res.locals.error = error;
        return next();
    }
});

router.get('/:id', checkAuthorization('admin', 'professor'), async (req, res, next) => {
    try {
        const result = await gymEquipmentService.get(req.params.id);
        return res.status(200).send(result);
    } catch (error) {
        error.action = 'get';
        res.locals.error = error;
        return next();
    }
});

router.post('/', checkAuthorization('admin'), async (req, res, next) => {
    try {
        await gymEquipmentService.insert(req.body);
        return res.status(200).send({ added: true, msg: 'equipment added successfully' });
    } catch (error) {
        if (error instanceof TypeError) {
            error.code = 'NULL_BODY';
            error.status = 400;
        }
        error.action = 'added';
        res.locals.error = error;
        return next();
    }
});

router.put('/:id', checkAuthorization('admin', 'professor'), async (req, res, next) => {
    try {
        await gymEquipmentService.update(req.params.id, req.body.status);
        return res.status(200).send({ updated: true, msg: 'status updated succesfully' });
    } catch (error) {
        error.action = 'updated';
        res.locals.error = error;
        return next();
    }
});

router.delete('/:id', checkAuthorization('admin'), async (req, res, next) => {
    try {
        const result = await gymEquipmentService.remove(req.params.id);
        if (!result.affectedRows) {
            return res.status(400).send({ deleted: false, msg: 'equipment not exists' });
        }
        return res.status(200).send({ deleted: true, msg: 'equipment deleted successfully' });
    } catch (error) {
        error.action = 'deleted';
        res.locals.error = error;
        return next();
    }
});

module.exports = router;
