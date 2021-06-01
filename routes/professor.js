const express = require('express');
const professorService = require('../services/professorService');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await professorService.getAll();
        return res.status(200).send(result);
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const result = await professorService.get(req.params.id);
        return res.status(200).send(result);
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.get('/schedule', async (req, res) => {
    try {
        const result = await professorService.getSchedules();
        return res.status(200).send(result);
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.get('/schedule/:id', async (req, res) => {
    try {
        const result = await professorService.getSchedule(req.params.id);
        return res.status(200).send(result);
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.post('/schedule', async (req, res) => {
    try {
        await professorService.addSchedule(req.body);
        return res.status(200).send({ added: true, msg: 'schedule added successfully' });
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.delete('/schedule', async (req, res) => {
    try {
        await professorService.removeSchedule(req.body);
        return res.status(200).send({ deleted: true, msg: 'schedule deleted successfully' });
    } catch (error) {
        return res.sendStatus(500);
    }
});

module.exports = router;
