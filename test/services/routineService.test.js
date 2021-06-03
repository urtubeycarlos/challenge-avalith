const { describe, it } = require('mocha');
const { beforeEach, afterEach } = require('mocha');
const { assert } = require('chai');
const routineService = require('../../services/routineService');

describe('Testing routine service', () => {
    const routines = [
        {
            clientId: 1,
            ejercicios: [
                'bicicleta',
                'abdominales',
                'espalda',
            ],
            dieta: 'alta en fibras',
        },
        {
            clientId: 2,
            ejercicios: [
                'espalda',
                'gluteos',
            ],
            dieta: 'astringente',
            observaciones: 'doble tiempo del habitual',
        },
    ];

    beforeEach(async () => {
        for (let i = 0; i < routines.length; i += 1) {
            const routine = routines[i];
            await routineService.insert(routine);
        }
    });

    afterEach(async () => {
        for (let i = 0; i < routines.length; i += 1) {
            const routine = routines[i];
            await routineService.remove(routine.clientId);
        }
    });

    describe('main methods', () => {
        it('getAll', async () => {
            const result = await routineService.getAll();
            assert.strictEqual(result.length, 2);
        });

        it('get', async () => {
            const result = await routineService.get(2);
            assert.deepEqual(result, routines[1]);
        });

        it('remove', async () => {
            await routineService.remove(routines[0].clientId);
            const result = await routineService.getAll();
            assert.strictEqual(result.length, 1);
        });

        it('insert', async () => {
            const newRoutine = {
                clientId: 3,
                ejercicios: [
                    'pecho',
                    'espalda',
                ],
            };
            await routineService.insert(newRoutine);
            const result = await routineService.getAll();
            assert.strictEqual(result.length, 3);
            await routineService.remove(newRoutine.clientId);
        });

        it('update', async () => {
            const newRoutine = {
                clientId: 2,
                ejercicios: [
                    'pecho',
                    'espalda',
                ],
            };
            await routineService.update(newRoutine);
            const result = await routineService.get(newRoutine.clientId);
            assert.notDeepEqual(result, newRoutine);
        });
    });

    describe('border cases', () => {
        describe('getAll', () => {
            it('empty result', async () => {
                for (let i = 0; i < routines.length; i += 1) {
                    const routine = routines[i];
                    await routineService.remove(routine.clientId);
                }
                const result = await routineService.getAll();
                assert.strictEqual(result.length, 0);
            });
        });
        describe('get', () => {
            it('null or undefined id', async () => {
                try {
                    await routineService.get(null);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('not integer id', async () => {
                try {
                    await routineService.get('something');
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_ID_NOT_INT');
                }
            });

            it('routine not exists', async () => {
                const result = await routineService.get(18);
                assert.equal(result, null);
            });
        });

        describe('remove', () => {
            it('null or undefined id', async () => {
                try {
                    await routineService.remove(undefined);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('not integer id', async () => {
                try {
                    await routineService.remove('something');
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_ID_NOT_INT');
                }
            });

            it('routine not exists', async () => {
                const commandResult = await routineService.remove(18);
                assert.strictEqual(commandResult.result.n, 0);
                const result = await routineService.getAll();
                assert.strictEqual(result.length, 2);
            });
        });

        describe('insert', async () => {
            it('null or undefined routine', async () => {
                try {
                    await routineService.insert(null);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('inexistent id', async () => {
                const badRoutine = {
                    ejercicios: [
                        'bici',
                        'pesas',
                    ],
                };
                try {
                    await routineService.insert(badRoutine);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('not integer id', async () => {
                const badRoutine = {
                    clientId: 'something',
                    ejercicios: [
                        'bici',
                        'pesas',
                    ],
                };
                try {
                    await routineService.insert(badRoutine);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_ID_NOT_INT');
                }
            });

            it('duplicate routine', async () => {
                try {
                    await routineService.insert(routines[0]);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_DUP_ENTRY');
                }
            });

            it('existent id', async () => {
                const badRoutine = {
                    clientId: 1,
                };
                try {
                    await routineService.insert(badRoutine);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_DUP_ENTRY');
                }
            });
        });

        describe('update', () => {
            it('null or undefined routine', async () => {
                try {
                    await routineService.update(null);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('inexistent id', async () => {
                const badRoutine = {
                    ejercicios: [
                        'bici',
                        'pesas',
                    ],
                };
                try {
                    await routineService.update(badRoutine);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('not integer id', async () => {
                const badRoutine = {
                    clientId: 'something',
                    ejercicios: [
                        'bici',
                        'pesas',
                    ],
                };
                try {
                    await routineService.update(badRoutine);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_ID_NOT_INT');
                }
            });
        });
    });
});
