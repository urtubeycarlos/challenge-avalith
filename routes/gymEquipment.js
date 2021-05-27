const express = require('express');
const gymEquipmentService = require('../services/gymEquipmentService');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await gymEquipmentService.getAll();
        return res.status(200).send(result);
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const result = await gymEquipmentService.get(req.params.id);
        return res.status(200).send(result);
    } catch (error) {
        if (error.code === 'ER_NOT_ID') {
            return res.status(400).send({ msg: 'Id must be provided' });
        }
        return res.sendStatus(500);
    }
});

router.post('/', async (req, res) => {
    try {
        const result = await gymEquipmentService.insert(req.body);
        return res.status(200).send(result);
    } catch (error) {
        if (error.code === 'ER_NOT_PARAM') {
            return res.sendStatus(400);
        }
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).send({ msg: 'name must be unique' });
        }
        return res.sendStatus(500);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const result = await gymEquipmentService.update(req.body);
        return res.status(200).send(result);
    } catch (error) {
        if (error.code === 'ER_NOT_PARAM') {
            return res.sendStatus(400);
        }
        if (error.code === 'ER_BAD_STATUS') {
            return res.sendStatus(400);
        }
        return res.sendStatus(500);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await gymEquipmentService.remove(req.params.id);
        return res.status(200).result(result);
    } catch (error) {
        return res.sendStatus(500);
    }
});

module.exports = router;
