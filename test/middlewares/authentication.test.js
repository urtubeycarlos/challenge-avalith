const { describe, it } = require('mocha');
const { beforeEach, afterEach } = require('mocha');
const { assert } = require('chai');
const sinon = require('sinon');
const { createToken } = require('../../utils/authentication');
const { decodeToken, checkAuthorization } = require('../../middlewares/authentication');

function sleep(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), milliseconds);
    });
}

describe('Testing authentication middleware', () => {
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

    describe('decodeToken', () => {
        it('null token', () => {
            req.headers.authorization = null;
            decodeToken(req, res, next);
            assert.isTrue(next.calledOnce);
        });

        it('invalid token', () => {
            req.headers.authorization = 'fsafsalkj';
            decodeToken(req, res, next);
            assert.isTrue(next.calledOnce);
            assert.isUndefined(req.token);
        });

        it('valid token', () => {
            decodeToken(req, res, next);
            assert.isTrue(next.calledOnce);
        });

        it('expired token', async () => {
            decodeToken(req, res, next);
            assert.isTrue(next.calledOnce);
            await sleep(1000);
            decodeToken(req, res, next);
            assert.isTrue(next.calledTwice);
            assert.isUndefined(req.token);
        });
    });

    describe('checkAuthorization', () => {
        it('null or undefined roles to check', () => {
            try {
                checkAuthorization(null);
            } catch (error) {
                assert.strictEqual(error.code, 'ER_NOT_ROLE');
            }
        });

        it('valid role', () => {
            const fn = checkAuthorization('client');
            fn(req, res, next);
            assert.isTrue(next.calledOnce);
        });

        it('invalid role', () => {
            const fn = checkAuthorization('admin');
            fn(req, res, next);
            assert.isTrue(res.sendStatus.calledOnceWith(401));
        });
    });
});
