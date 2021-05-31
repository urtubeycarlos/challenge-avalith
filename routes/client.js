const express = require('express');
const clientService = require('../services/clientService');
const { checkRole } = require('../middlewares/authentication');

const router = express.Router();

router.get('/', checkRole('admin'), async (req, res) => {
    try {
        const result = await clientService.getClients();
        return res.status(200).send(result);
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.get('/:id', checkRole('admin'), async (req, res) => {
    try {
        const result = await clientService.getClient(req.params.id);
        return res.status(200).send(result);
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.get('/visits', checkRole('professor', 'admin'), async (req, res) => {
    try {
        const result = await clientService.getVisits();
        return res.status(200).send(result);
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.get('/visits/:id', checkRole('professor', 'admin'), async (req, res) => {
    try {
        const result = await clientService.getClientVisits(req.params.id);
        return res.status(200).send(result);
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.post('/visits', checkRole('professor', 'admin'), async (req, res) => {
    try {
        await clientService.addVisit(req.body);
        return res.status(200).send({ added: true, msg: 'visit added successfully' });
    } catch (error) {
        return res.sendStatus(500);
    }
});

module.exports = router;
