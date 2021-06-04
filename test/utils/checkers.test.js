const { describe, it } = require('mocha');
const { assert } = require('chai');
const { checkID, checkParams } = require('../../utils/checkers');

describe('Testing checkers', () => {
    describe('checkID', () => {
        it('valid param', () => {
            const result = checkID(1);
            assert.strictEqual(result, 1);
        });

        it('null or undefined param', () => {
            try {
                checkID(null);
            } catch (error) {
                assert.strictEqual(error.code, 'ER_NOT_ID');
            }
        });

        it('string param', () => {
            try {
                checkID('something');
            } catch (error) {
                assert.strictEqual(error.code, 'ER_ID_NOT_INT');
            }
        });

        it('float param', () => {
            try {
                checkID(10.5);
            } catch (error) {
                assert.strictEqual(error.code, 'ER_ID_NOT_INT');
            }
        });
    });

    describe('checkParams', () => {
        it('valid params', () => {
            const params = ['something', 1, 15.780];
            const result = checkParams('something', 1, 15.780);
            assert.deepStrictEqual(result, params);
        });

        it('null or undefined params', () => {
            try {
                checkParams(null, null, undefined);
            } catch (error) {
                assert.strictEqual(error.code, 'ER_NOT_PARAM');
            }
        });
    });
});
