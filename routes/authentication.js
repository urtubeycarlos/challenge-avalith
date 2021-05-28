const express = require('express');
const userService = require('../services/userService');

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const user = await userService.get(req.body);
        if (Object.keys(user).length === 0) {
            return res.status(403).send({ logged: false, msg: 'invalid email or password' });
        }
        try {
            delete user.password;
            const encodedToken = await userService.createToken(user, '1d');
            return res.status(202).send({ logged: true, msg: 'logged succesfully', token: encodedToken });
        } catch (error) {
            return res.sendStatus(500);
        }
    } catch (error) {
        if (error.code === 'ER_NOT_PARAM') {
            return res.sendStatus(400);
        }
        return res.sendStatus(500);
    }
});

router.post('/signup', async (req, res) => {
    try {
        await userService.insert(req.body);
        return res.status(200).send({ signup: true, msg: 'user added successfully' });
    } catch (error) {
        if (error.code === 'ER_NOT_PARAM') {
            return res.sendStatus(400);
        }
        return res.sendStatus(500);
    }
});

router.put('/changepassword', async (req, res) => {
    try {
        const result = await userService.update(req.body);
        if (result.affectedRows === 0) {
            return res.status(400).send({ password_changed: false, msg: 'invalid email or password' });
        }
        return res.status(200).send({ password_changed: true, msg: 'password changed' });
    } catch (error) {
        if (error.code === 'ER_NOT_PARAM') {
            return res.sendStatus(400);
        }
        return res.sendStatus(500);
    }
});

router.delete('/delete', async (req, res) => {
    try {
        const result = await userService.remove(req.body);
        if (result.affectedRows === 0) {
            return res.status(400).send({ signdown: false, msg: 'invalid email or password' });
        }
        return res.status(200).send({ status: 200, signdown: false, msg: 'user eliminated succesfully' });
    } catch (error) {
        if (error.code === 'ER_NOT_PARAM') {
            return res.sendStatus(400);
        }
        return res.sendStatus(500);
    }
});

module.exports = router;