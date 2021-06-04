const { describe, it } = require('mocha');
const { beforeEach, afterEach } = require('mocha');
const { assert } = require('chai');
const sinon = require('sinon');
const { createToken } = require('../../services/userService');
const { checkToken, checkRole } = require('../../middlewares/authentication');

function sleep(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), milliseconds);
    });
}

describe.only('Testing authentication middleware', () => {
    const req = {
        headers: {
            authorization: '',
        },
    };

    const res = {
        sendStatus: sinon.spy(),
    };

    const next = sinon.spy();

    const fakeUser = {
        id: 1,
        name: 'John',
        surname: 'Doe',
        email: 'johndoe@gmail.com',
        role: 'client',
    };

    beforeEach(async () => {
        req.headers.authorization = await createToken(fakeUser, '1000');
        req.token = fakeUser;
    });

    afterEach(() => {
        res.sendStatus.resetHistory();
        next.resetHistory();
    });

    describe('checkToken', () => {
        it('null token', () => {
            req.headers.authorization = null;
            checkToken(req, res, next);
            assert.isTrue(res.sendStatus.calledOnceWith(401));
        });

        it('invalid token', () => {
            req.headers.authorization = 'fsafsalkj';
            checkToken(req, res, next);
            assert.isTrue(res.sendStatus.calledOnceWith(401));
        });

        it('valid token', () => {
            checkToken(req, res, next);
            assert.isTrue(next.calledOnce);
        });

        it('expired token', async () => {
            checkToken(req, res, next);
            assert.isTrue(next.calledOnce);
            await sleep(1000);
            checkToken(req, res, next);
            assert.isTrue(res.sendStatus.calledOnceWith(401));
        });
    });

    describe('checkRole', () => {
        it('null or undefined roles to check', () => {
            try {
                checkRole(null);
            } catch (error) {
                assert.strictEqual(error.code, 'ER_NOT_ROLE');
            }
        });

        it('valid role', () => {
            const fn = checkRole('client');
            fn(req, res, next);
            assert.isTrue(next.calledOnce);
        });

        it('invalid role', () => {
            const fn = checkRole('admin');
            fn(req, res, next);
            assert.isTrue(res.sendStatus.calledOnceWith(401));
        });
    });
});
