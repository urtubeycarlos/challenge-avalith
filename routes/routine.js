const express = require('express');
const routineService = require('../services/routineService');
const { checkRole } = require('../middlewares/authentication');

const router = express.Router();

router.get('/', checkRole('client', 'professor'), async (req, res) => {
    try {
        const result = await routineService.getAll();
        return res.status(200).send(result);
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.get('/:id', checkRole('client', 'professor'), async (req, res) => {
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

router.post('/', checkRole('professor'), async (req, res) => {
    try {
        await routineService.insert(req.body);
        return res.status(200).send({ inserted: true, msg: 'routine added successfully' });
    } catch (error) {
        if (error.code === 'ER_NOT_ID') {
            return res.status(400).send({ inserted: false, msg: 'Id must be provided' });
        }
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).send({ inserted: false, msg: 'duplicated routine for client_id entry' });
        }
        return res.sendStatus(500);
    }
});

router.put('/', checkRole('professor'), async (req, res) => {
    try {
        await routineService.update(req.body);
        return res.status(200).send({ updated: true, msg: 'routine updated successfully' });
    } catch (error) {
        if (error.code === 'ER_NOT_ID') {
            return res.status(400).send({ updated: false, msg: 'Id must be provided' });
        }
        return res.sendStatus(500);
    }
});

router.delete('/:id', checkRole('professor'), async (req, res) => {
    try {
        const result = await routineService.remove(req.params.id);
        if (result.result.n === 0) {
            return res.status(400).send({ deleted: false, msg: 'routine not exists for passed id' });
        }
        return res.status(200).send({ deleted: true, msg: 'routine deleted successfully' });
    } catch (error) {
        if (error.code === 'ER_NOT_ID') {
            return res.status(400).send({ deleted: false, msg: 'Id must be provided' });
        }
        return res.sendStatus(500);
    }
});

module.exports = router;
