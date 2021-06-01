const express = require('express');
const gymEquipmentService = require('../services/gymEquipmentService');
const { checkRole } = require('../middlewares/authentication');

const router = express.Router();

router.get('/', checkRole('admin', 'professor'), async (req, res) => {
    try {
        const result = await gymEquipmentService.getAll();
        return res.status(200).send(result);
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.get('/:id', checkRole('admin', 'professor'), async (req, res) => {
    try {
        const result = await gymEquipmentService.get(req.params.id);
        return res.status(200).send(result);
    } catch (error) {
        if (error.code === 'ER_NOT_ID') {
            return res.status(400).send({ errorCode: error.code, msg: 'Id must be provided' });
        }
        if (error.code === 'ER_ID_NOT_INT') {
            return res.status(400).send({ errorCode: error.code, msg: 'id must be an integer' });
        }
        return res.sendStatus(500);
    }
});

router.post('/', checkRole('admin'), async (req, res) => {
    try {
        await gymEquipmentService.insert(req.body);
        return res.status(200).send({ inserted: true, msg: 'equipment added successfully' });
    } catch (error) {
        if (error.code === 'ER_NOT_PARAM') {
            return res.status(400).send({ inserted: false, errorCode: error.code, msg: 'missing params' });
        }
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).send({ inserted: false, errorCode: error.code, msg: 'name must be unique' });
        }
        return res.sendStatus(500);
    }
});

router.put('/:id', checkRole('admin', 'professor'), async (req, res) => {
    try {
        await gymEquipmentService.update(req.params.id, req.body.status);
        return res.status(200).send({ updated: true, msg: 'status updated succesfully' });
    } catch (error) {
        if (error.code === 'ER_NOT_ID') {
            return res.status(400).send({ errorCode: error.code, msg: 'Id must be provided' });
        }
        if (error.code === 'ER_ID_NOT_INT') {
            return res.status(400).send({ errorCode: error.code, msg: 'id must be an integer' });
        }
        if (error.code === 'ER_NOT_PARAM') {
            return res.status(400).send({ errorCode: error.code, updated: false, msg: 'field status not exists' });
        }
        if (error.code === 'ER_BAD_STATUS') {
            return res.status(400).send({ errorCode: error.code, updated: false, msg: 'status must be 1 for "working" or 2 for "out of service"' });
        }
        return res.sendStatus(500);
    }
});

router.delete('/:id', checkRole('admin'), async (req, res) => {
    try {
        const result = await gymEquipmentService.remove(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(400).send({ deleted: false, msg: 'equipment not exists' });
        }
        return res.status(200).send({ deleted: true, msg: 'equipment deleted successfully' });
    } catch (error) {
        if (error.code === 'ER_NOT_ID') {
            return res.status(400).send({ errorCode: error.code, msg: 'Id must be provided' });
        }
        if (error.code === 'ER_ID_NOT_INT') {
            return res.status(400).send({ errorCode: error.code, msg: 'id must be an integer' });
        }
        return res.sendStatus(500);
    }
});

module.exports = router;
