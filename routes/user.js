const express = require('express');
const userService = require('../services/userService');
const { createToken } = require('../utils/authentication');
const { checkAuthorization, checkIDs } = require('../middlewares/authentication');

const router = express.Router();
const roles = ['client', 'professor', 'admin'];

router.get('/all', checkAuthorization('admin'), async (req, res, next) => {
    try {
        const result = await userService.getAll();
        return res.status(200).send(result);
    } catch (error) {
        error.action = 'getAll';
        res.locals.error = error;
        return next();
    }
});

router.get('/client', checkAuthorization('professor', 'admin'), async (req, res, next) => {
    try {
        const result = await userService.getAll('client');
        return res.status(200).send(result);
    } catch (error) {
        error.action = 'getClients';
        res.locals.error = error;
        return next();
    }
});

router.get('/professor/:id', checkAuthorization('professor', 'admin'), checkIDs, async (req, res, next) => {
    try {
        const result = await userService.get({ id: req.params.id });
        return res.status(200).send(result);
    } catch (error) {
        error.action = 'getProfessor';
        res.locals.error = error;
        return next();
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const user = await userService.get(req.body);
        if (!Object.keys(user).length) {
            return res.status(403).send({ logged: false, errorCode: 'ER_INV_CREDENTIAL' });
        }
        try {
            delete user.password;
            const encodedToken = await createToken(user, '1d');
            return res.status(202).send({ logged: true, token: encodedToken });
        } catch (error) {
            return res.sendStatus(500);
        }
    } catch (error) {
        error.action = 'login';
        res.locals.error = error;
        return next();
    }
});

router.post('/signup', async (req, res, next) => {
    req.body.role = 'client'; // un rol en la bd comienza en 1, por eso al indice de 'user' se le suma 1
    try {
        await userService.insert(req.body);
        return res.status(200).send({ signup: true });
    } catch (error) {
        error.action = 'signup';
        res.locals.error = error;
        return next();
    }
});

router.post('/signup_admin', checkAuthorization('admin'), async (req, res, next) => {
    const validRole = roles.indexOf(req.body.role); // buscamos si se encuentra el rol en el array
    if (validRole === -1) { // -1 si no se encontró...
        return res.status(400).send({ signup: false, errorCode: 'ER_BAD_ROLE' });
    }
    try {
        await userService.insert(req.body);
        return res.status(200).send({ signup: true });
    } catch (error) {
        error.action = 'signup';
        res.locals.error = error;
        return next();
    }
});

router.put('/update', async (req, res, next) => {
    try {
        const result = await userService.update(req.body);
        if (!result.affectedRows) {
            return res.status(400).send({ updated: false, msg: 'invalid email or password' });
        }
        return res.status(200).send({ updated: true, msg: 'password changed' });
    } catch (error) {
        error.action = 'update';
        res.locals.error = error;
        return next();
    }
});

router.delete('/delete', async (req, res, next) => {
    try {
        const result = await userService.remove(req.body);
        if (!result.affectedRows) {
            return res.status(400).send({ deleted: false, msg: 'invalid email or password' });
        }
        return res.status(200).send({ deleted: false, msg: 'user eliminated succesfully' });
    } catch (error) {
        error.action = 'delete';
        res.locals.error = error;
        return next();
    }
});

module.exports = router;
