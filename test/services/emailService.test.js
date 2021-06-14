const { describe, it } = require('mocha');
const { assert } = require('chai');
const { sendMail } = require('../../services/emailService');

describe('Testing email service', async () => {
    const fakeEmail = {
        subject: 'subject',
        content: 'content',
        recipients: ['huiifzdr@sharklasers.com'], // Guerrilla mails service.
    };

    describe('mail methods', () => {
        it('sendEmail', async () => {
            const result = await sendMail(fakeEmail);
            assert.isTrue(result.response.includes('OK'));
        }).timeout(5000);
    });

    describe('border cases', () => {
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
