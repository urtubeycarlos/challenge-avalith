const express = require('express');
const routineService = require('../services/routineService');
const { checkRole } = require('../middlewares/authentication');

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
            return res.status(400).send({ errorCode: error.code, msg: 'Id must be provided' });
        }
        if (error.code === 'ER_ID_NOT_INT') {
            return res.status(400).send({ errorCode: error.code, msg: 'Id must be an integer' });
        }
        return res.sendStatus(500);
    }
});

router.post('/', checkRole('professor', 'admin'), async (req, res) => {
    try {
        await routineService.insert(req.body);
        return res.status(200).send({ inserted: true, msg: 'routine added successfully' });
    } catch (error) {
        if (error.code === 'ER_NOT_ID') {
            return res.status(400).send({ inserted: false, errorCode: error.code, msg: 'Id must be provided' });
        }
        if (error.code === 'ER_ID_NOT_INT') {
            return res.status(400).send({ inserted: false, errorCode: error.code, msg: 'Id must be an integer' });
        }
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).send({ inserted: false, errorCode: error.code, msg: 'duplicated routine for client_id entry' });
        }
        return res.sendStatus(500);
    }
});

router.put('/', checkRole('professor', 'admin'), async (req, res) => {
    try {
        await routineService.update(req.body);
        return res.status(200).send({ updated: true, msg: 'routine updated successfully' });
    } catch (error) {
        if (error.code === 'ER_NOT_ID') {
            return res.status(400).send({ updated: false, errorCode: error.code, msg: 'Id must be provided' });
        }
        if (error.code === 'ER_ID_NOT_INT') {
            return res.status(400).send({ updated: false, errorCode: error.code, msg: 'Id must be an integer' });
        }
        return res.sendStatus(500);
    }
});

router.delete('/:id', checkRole('professor', 'admin'), async (req, res) => {
    try {
        const result = await routineService.remove(req.params.id);
        if (!result.result.n) {
            return res.status(400).send({ deleted: false, errorCode: 'ER_NOT_EXISTS', msg: 'routine not exists for passed id' });
        }
        return res.status(200).send({ deleted: true, msg: 'routine deleted successfully' });
    } catch (error) {
        if (error.code === 'ER_NOT_ID') {
            return res.status(400).send({ deleted: false, errorCode: error.code, msg: 'Id must be provided' });
        }
        if (error.code === 'ER_ID_NOT_INT') {
            return res.status(400).send({ deleted: false, errorCode: error.code, msg: 'Id must be an integer' });
        }
        return res.sendStatus(500);
    }
});

module.exports = router;
