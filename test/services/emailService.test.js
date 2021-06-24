const { describe, it, before, after } = require('mocha');
const { assert } = require('chai');
const nodemailer = require('nodemailer');
const sinon = require('sinon');
const { sendMail } = require('../../services/emailService');

describe.only('Testing email service', async () => {
    const fakeEmail = {
        subject: 'subject',
        content: 'content',
        recipients: ['huiifzdr@sharklasers.com'], // Guerrilla mails service.
    };

    const transport = {
        sendMail: (data, callback) => {
            callback(null, data);
        },
    };

    const transportWithError = {
        sendMail: (data, callback) => {
            const error = new Error();
            error.code = 'ER_SEND_FAILED';
            callback(error, null);
        },
    };

    let stub;

    before(() => {
        stub = sinon.stub(nodemailer, 'createTransport').returns(transport);
    });

    after(() => {
        stub.restore();
    });

    describe('mail methods', () => {
        it('sendEmail', async () => {
            const result = await sendMail(fakeEmail);
            const expectedResult = {
                from: 'roadlessdeveloper@gmail.com',
                to: ['huiifzdr@sharklasers.com'],
                subject: 'subject',
                text: 'content',
            };
            assert.deepEqual(result, expectedResult);
        }).timeout(10000);
    });

    describe('border cases', () => {
        it('error sending mails', async () => {
            stub.restore();
            stub = sinon.stub(nodemailer, 'createTransport').returns(transportWithError);
            try {
                await sendMail(fakeEmail);
            } catch (error) {
                assert.strictEqual(error.code, 'ER_SEND_FAILED');
            }
        });

        it('null or undefined param', async () => {
            try {
                await sendMail(null);
            } catch (error) {
                assert.isTrue(error instanceof TypeError);
            }
        });

        it('null or undefined values', async () => {
            try {
                await sendMail({ subject: null, content: null, recipients: null });
            } catch (error) {
                assert.strictEqual(error.code, 'ER_NOT_PARAM');
            }
        });
    });
});
