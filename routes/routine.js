const express = require('express');
const routineService = require('../services/routineService');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await routineService.getAll();
        return res.status(200).send(result);
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const result = await routineService.get(req.params.id);
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
        const result = await routineService.insert(req.body);
        return res.status(200).send(result);
    } catch (error) {
        if (error.code === 'ER_NOT_ID') {
            return res.status(400).send({ msg: 'Id must be provided' });
        }
        return res.sendStatus(500);
    }
});

router.put('/:id', async (req, res) => {
    try {
        req.body.client_id = req.params.id;
        const result = await routineService.update(req.body);
        return res.status(200).send(result);
    } catch (error) {
        if (error.code === 'ER_NOT_ID') {
            return res.status(400).send({ msg: 'Id must be provided' });
        }
        return res.sendStatus(500);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await routineService.remove(req.params.id);
        return res.status(200).send(result);
    } catch (error) {
        if (error.code === 'ER_NOT_ID') {
            return res.status(400).send({ msg: 'Id must be provided' });
        }
        return res.sendStatus(500);
    }
});

module.exports = router;
