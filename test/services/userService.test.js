const { describe, it } = require('mocha');
const { beforeEach, afterEach } = require('mocha');
const { assert } = require('chai');
const md5 = require('md5');
const userService = require('../../services/userService');

describe('Testing userService', () => {
    const fakeUsers = [
        {
            name: 'Carlos',
            surname: 'Urtubey',
            email: 'urtubeycarlos.0510@gmail.com',
            password: 'abcd',
            role: 1,
        },
        {
            name: 'John',
            surname: 'Doe',
            email: 'john.doe@gmail.com',
            password: '1234',
            role: 2,
        },
        {
            name: 'Tony',
            surname: 'Stark',
            email: 'tony.stark@gmail.com',
            password: 'abc123',
            role: 3,
        },
    ];

    beforeEach(async () => {
        for (let i = 0; i < fakeUsers.length; i += 1) {
            const user = fakeUsers[i];
            await userService.insert(user);
        }
    });

    afterEach(async () => {
        for (let i = 0; i < fakeUsers.length; i += 1) {
            const user = fakeUsers[i];
            await userService.remove(user);
        }
    });

    describe('main methods', () => {
        it('getAll', async () => {
            const result = await userService.getAll();
            assert.strictEqual(result.length, 3);
        });

        it('getAll with role', async () => {
            const result = await userService.getAll('client');
            assert.strictEqual(result.length, 1);
        });

        it('getAll with multiple roles', async () => {
            const result = await userService.getAll('client', 'professor');
            assert.strictEqual(result.length, 2);
        });

        it('get', async () => {
            const result = await userService.get(fakeUsers[0]);
            assert.strictEqual(result.email, fakeUsers[0].email);
            assert.strictEqual(result.password, md5(fakeUsers[0].password));
            const resultById = await userService.get({ id: result.id });
            assert.strictEqual(resultById.email, result.email);
            assert.strictEqual(resultById.password, result.password);
        });

        it('remove', async () => {
            await userService.remove(fakeUsers[0]);
            const result = await userService.getAll();
            assert.strictEqual(result.length, 2);
        });

        it('insert', async () => {
            const newUser = {
                name: 'Jane',
                surname: 'Doe',
                email: 'jane.doe@outlook.com',
                password: '123abc',
                role: 1,
            };
            await userService.insert(newUser);
            const dbContent = await userService.getAll();
            assert.strictEqual(dbContent.length, 4);
            await userService.remove(newUser);
        });

        it('update', async () => {
            const newData = {
                email: 'urtubeycarlos.0510@gmail.com',
                password: 'abcd',
                newPassword: '1234',
            };
            await userService.update(newData);
            const toGet = {
                email: newData.email,
                password: newData.newPassword,
            };
            const updated = await userService.get(toGet);
            assert.strictEqual(updated.email, fakeUsers[0].email);
            assert.notStrictEqual(updated.password, md5(fakeUsers[0].password));
            const toRestore = {
                email: fakeUsers[0].email,
                password: newData.newPassword,
                newPassword: fakeUsers[0].password,
            };
            await userService.update(toRestore);
        });
    });

    describe('border cases', () => {
        describe('getAll', () => {
            it('empty result', async () => {
                for (let i = 0; i < fakeUsers.length; i += 1) {
                    const user = fakeUsers[i];
                    await userService.remove(user);
                }
                const result = await userService.getAll();
                assert.strictEqual(result.length, 0);
            });
        });

        describe('get', () => {
            it('undefined or null param', async () => {
                try {
                    await userService.get(null);
                } catch (error) {
                    assert.isTrue(error instanceof TypeError);
                }
            });

            it('undefined or null values', async () => {
                try {
                    await userService.get({ email: null, password: undefined });
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('empty param', async () => {
                try {
                    await userService.get({});
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('user not exists', async () => {
                const inexistentUser = {
                    email: 'erik@coldmail.com',
                    password: '5678',
                };
                const result = await userService.get(inexistentUser);
                assert.deepEqual(result, {});
            });
        });

        describe('remove', () => {
            it('undefined or null param', async () => {
                try {
                    await userService.remove(null);
                } catch (error) {
                    assert.isTrue(error instanceof TypeError);
                }
            });

            it('undefined or null values', async () => {
                try {
                    await userService.remove({ email: null, password: null });
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('empty param', async () => {
                try {
                    await userService.remove({});
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('inexistent user', async () => {
                const inexistentUser = {
                    email: 'erik@coldmail.com',
                    password: '5678',
                };
                const result = await userService.remove(inexistentUser);
                assert.strictEqual(result.affectedRows, 0);
            });

            it('invalid mail or password', async () => {
                const incorrect = {
                    email: fakeUsers[0].email,
                    password: fakeUsers[1].password,
                };
                const result = await userService.remove(incorrect);
                assert.strictEqual(result.affectedRows, 0);
            });
        });

        describe('insert', () => {
            it('undefined or null param', async () => {
                try {
                    await userService.insert(null);
                } catch (error) {
                    assert.isTrue(error instanceof TypeError);
                }
            });

            it('undefined or null values', async () => {
                try {
                    await userService.insert({ email: null, password: null });
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('empty param', async () => {
                try {
                    await userService.insert({});
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('re activate user', async () => {
                await userService.remove(fakeUsers[0]);
                let dbContent = await userService.getAll();
                assert.strictEqual(dbContent.length, 2);
                await userService.insert(fakeUsers[0]);
                dbContent = await userService.getAll();
                assert.strictEqual(dbContent.length, 3);
            });

            it('insert duplicate', async () => {
                const result = await userService.insert(fakeUsers[0]);
                assert.strictEqual(result.changedRows, 0);
            });
        });

        describe('update', () => {
            it('undefined or null param', async () => {
                try {
                    await userService.update(null);
                } catch (error) {
                    assert.isTrue(error instanceof TypeError);
                }
            });

            it('undefined or null values', async () => {
                try {
                    await userService.update({ email: null, password: null, newPassword: null });
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('empty param', async () => {
                try {
                    await userService.update({});
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('blank param', async () => {
                const blankParams = {
                    email: 'urtubeycarlos.0510@gmail.com',
                    password: '1234',
                    newPassword: '',
                };

                try {
                    await userService.update(blankParams);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_BLANK_PARAM');
                }
            });

            it('user not exists', async () => {
                const inexistentUser = {
                    email: 'erik@coldmail.com',
                    password: '5678',
                    newPassword: 'abcde',
                };
                const result = await userService.update(inexistentUser);
                assert.strictEqual(result.affectedRows, 0);
            });

            it('no values to update', async () => {
                const toNotUpdate = {
                    newPassword: fakeUsers[0].password,
                    email: fakeUsers[0].email,
                    password: fakeUsers[0].password,
                };
                const result = await userService.update(toNotUpdate);
                assert.strictEqual(result.changedRows, 0);
            });
        });
    });
});
