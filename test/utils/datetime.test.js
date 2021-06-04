const { describe, it } = require('mocha');
const { assert } = require('chai');
const datetime = require('../../utils/datetime');

describe.only('Testing datetime utils', () => {
    describe('checkValidDay', () => {
        it('valid day', () => {
            const day = datetime.checkValidDay(5);
            assert.strictEqual(day, 5);
        });

        it('null or undefined day', () => {
            try {
                datetime.checkValidDay(null);
            } catch (error) {
                assert.strictEqual(error.code, 'ER_NOT_DAY');
            }
        });

        it('invalid day', () => {
            try {
                datetime.checkValidDay(8);
            } catch (error) {
                assert.strictEqual(error.code, 'ER_BAD_DAY');
            }
        });
    });

    describe('checkValidDate', () => {
        it('valid date', () => {
            const date1 = '09/06/1994';
            const date2 = '09-06-1994';
            const valid1 = datetime.checkValidDate(date1);
            const valid2 = datetime.checkValidDate(date2);
            assert.isTrue(valid1);
            assert.isTrue(valid2);
        });

        it('null or undefined date', () => {
            try {
                datetime.checkValidDate(undefined);
            } catch (error) {
                assert.strictEqual(error.code, 'ER_NOT_DATE');
            }
        });

        it('invalid date', () => {
            try {
                datetime.checkValidDate('09&06&1994');
            } catch (error) {
                assert.strictEqual(error.code, 'ER_BAD_DATE');
            }

            try {
                datetime.checkValidDate('09/06/94');
            } catch (error) {
                assert.strictEqual(error.code, 'ER_BAD_DATE');
            }
        });
    });

    describe('checkValidTime', () => {
        it('valid time', () => {
            const time = '15:30:00';
            const valid = datetime.checkValidTime(time);
            assert.isTrue(valid);
        });

        it('null or undefined time', () => {
            try {
                datetime.checkValidTime(null);
            } catch (error) {
                assert.strictEqual(error.code, 'ER_NOT_TIME');
            }
        });

        it('invalid time', () => {
            const invalidTime = '155:421:00';
            try {
                datetime.checkValidTime(invalidTime);
            } catch (error) {
                assert.strictEqual(error.code, 'ER_BAD_TIME');
            }
        });
    });

    describe('checkValidDateTime', () => {
        it('valid datetime', () => {
            const dateTime = '09/06/1994 15:00:00';
            const valid = datetime.checkValidDateTime(dateTime);
            assert.isTrue(valid);
        });

        it('null or undefined datetime', () => {
            try {
                datetime.checkValidDateTime(null);
            } catch (error) {
                assert.strictEqual(error.code, 'ER_NOT_DATETIME');
            }
        });

        it('invalid datetime', () => {
            const invalidDateTime = '009/20/94 155:30:00';
            try {
                datetime.checkValidDateTime(invalidDateTime);
            } catch (error) {
                assert.strictEqual(error.code, 'ER_BAD_DATETIME');
            }
        });
    });

    describe('formatDateToMySQL', () => {
        it('valid formating', () => {
            const unformated = '09-06-1994';
            const formated = datetime.formatDateToMySQL(unformated);
            assert.strictEqual(formated, '1994-06-09');
        });

        it('null or undefined date', () => {
            try {
                datetime.formatDateToMySQL(undefined);
            } catch (error) {
                assert.strictEqual(error.code, 'ER_NOT_DATE');
            }
        });

        it('invalid date', () => {
            try {
                datetime.formatDateToMySQL('09&06&1994');
            } catch (error) {
                assert.strictEqual(error.code, 'ER_BAD_DATE');
            }

            try {
                datetime.checkValidDate('09/06/94');
            } catch (error) {
                assert.strictEqual(error.code, 'ER_BAD_DATE');
            }
        });
    });

    describe('formatDateTimeToMySQL', () => {
        it('valid formating', () => {
            const unformated = '09-06-1994 15:30:00';
            const formated = datetime.formatDateTimeToMySQL(unformated);
            assert.strictEqual(formated, '1994-06-09 15:30:00');
        });

        it('null or undefined datetime', () => {
            try {
                datetime.formatDateTimeToMySQL(null);
            } catch (error) {
                assert.strictEqual(error.code, 'ER_NOT_DATETIME');
            }
        });

        it('invalid datetime', () => {
            const invalidDateTime = '009/20/94 155:30:00';
            try {
                datetime.formatDateTimeToMySQL(invalidDateTime);
            } catch (error) {
                assert.strictEqual(error.code, 'ER_BAD_DATETIME');
            }
        });
    });

    describe('formatDateTimeToUser', () => {
        it('valid formating', () => {
            const unformated = '1994-06-09 15:30:00';
            const formated = datetime.formatDateTimeToUser(unformated);
            assert.strictEqual(formated, '09-06-1994 15:30:00');
        });

        it('null or undefined datetime', () => {
            try {
                datetime.formatDateTimeToUser(null);
            } catch (error) {
                assert.strictEqual(error.code, 'ER_NOT_DATETIME');
            }
        });

        it('invalid datetime', () => {
            const invalidDateTime = '1994/20/94 155:30:00';
            try {
                datetime.formatDateTimeToUser(invalidDateTime);
            } catch (error) {
                assert.strictEqual(error.code, 'ER_BAD_DATETIME');
            }
        });
    });
});
