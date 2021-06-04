const { describe, it } = require('mocha');
const { beforeEach, afterEach } = require('mocha');
const { assert } = require('chai');
const userService = require('../../services/userService');
const clientService = require('../../services/clientService');

describe('Testing client service', () => {
    const fakeClients = [
        {
            name: 'Carlos',
            surname: 'Urtubey',
            email: 'urtubeycarlos.0510@gmail.com',
            password: 'abcd',
            role: 1,
        },
    ];

    const fakeVisits = [
        {
            visitDay: 3,
            visitDateTime: '09-06-2021 17:00:00',
        },
        {
            visitDay: 4,
            visitDateTime: '08-06-2021 15:30:00',
        },
    ];

    beforeEach(async () => {
        for (let i = 0; i < fakeClients.length; i += 1) {
            const client = fakeClients[i];
            await userService.insert(client);
        }
        const clients = await clientService.getAll();
        for (let i = 0; i < clients.length; i += 1) {
            const client = clients[i];
            for (let j = 0; j < fakeVisits.length; j += 1) {
                const visit = fakeVisits[j];
                visit.clientId = client.id;
                await clientService.addVisit(visit);
            }
        }
    });

    afterEach(async () => {
        for (let i = 0; i < fakeClients.length; i += 1) {
            const client = fakeClients[i];
            await userService.remove(client);
        }
        const visits = await clientService.getAllVisits();
        for (let i = 0; i < visits.length; i += 1) {
            const visit = visits[i];
            clientService.removeVisit(visit);
        }
    });

    describe('main methods', () => {
        it('getAll', async () => {
            const result = await clientService.getAll();
            assert.strictEqual(result.length, 1);
        });

        it('get', async () => {
            const allClients = await clientService.getAll();
            const client = allClients[allClients.length - 1];
            const result = await clientService.get(client);
            assert.deepEqual(result, client);
        });

        it('getAllVisits', async () => {
            const allVisits = await clientService.getAllVisits();
            assert.strictEqual(allVisits.length, 2);
        });

        it('getClientVisits', async () => {
            const allClients = await clientService.getAll();
            const client = allClients[allClients.length - 1];
            const result = await clientService.getClientVisits(client.id);
            assert.strictEqual(result.length, 2);
        });

        it('addVisit', async () => {
            const allClients = await clientService.getAll();
            const client = allClients[allClients.length - 1];
            const newVisit = {
                clientId: client.id,
                visitDay: 4,
                visitDateTime: '08-06-2021 15:30:00',
            };
            await clientService.addVisit(newVisit);
            const result = await clientService.getAllVisits();
            assert.strictEqual(result.length, 3);
        });

        it('removeVisit', async () => {
            const visit = fakeVisits[0];
            const allClients = await clientService.getAll();
            const client = allClients[allClients.length - 1];
            visit.clientId = client.id;
            await clientService.removeVisit(visit);
            const result = await clientService.getAllVisits();
            assert.strictEqual(result.length, 1);
        });
    });

    describe('border cases', () => {
        describe('getAll', () => {
            it('empty result', async () => {
                for (let i = 0; i < fakeClients.length; i += 1) {
                    const client = fakeClients[i];
                    await userService.remove(client);
                }
                const result = await clientService.getAll();
                assert.strictEqual(result.length, 0);
            });
        });

        describe('get', () => {
            it('null or undefined param', async () => {
                try {
                    await clientService.get(null);
                } catch (error) {
                    assert.isTrue(error instanceof TypeError);
                }
            });

            it('undefined or null values', async () => {
                try {
                    await clientService.get({ email: null, password: undefined });
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('empty param', async () => {
                try {
                    await clientService.get({});
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('client not exists', async () => {
                const inexistentClient = {
                    email: 'erik@coldmail.com',
                    password: '5678',
                };
                const result = await clientService.get(inexistentClient);
                assert.deepEqual(result, {});
            });
        });

        describe('getAllVisits', () => {
            it('empty result', async () => {
                const clients = await clientService.getAll();
                for (let i = 0; i < clients.length; i += 1) {
                    const client = clients[i];
                    for (let j = 0; j < fakeVisits.length; j += 1) {
                        const visit = fakeVisits[j];
                        visit.clientId = client.id;
                        await clientService.removeVisit(visit);
                    }
                }
                const result = await clientService.getAllVisits();
                assert.strictEqual(result.length, 0);
            });
        });

        describe('getClientVisits', () => {
            it('null or undefined id', async () => {
                try {
                    await clientService.getClientVisits(null);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('not integer id', async () => {
                try {
                    await clientService.getClientVisits('something');
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_ID_NOT_INT');
                }
            });

            it('empty result and not existing client', async () => {
                const clients = await clientService.getAll();
                const client = clients[clients.length - 1];
                const result = await clientService.getClientVisits(client.id + 1);
                assert.strictEqual(result.length, 0);
            });
        });

        describe('addVisit', () => {
            it('null or undefined param', async () => {
                try {
                    await clientService.addVisit(null);
                } catch (error) {
                    assert.isTrue(error instanceof TypeError);
                }
            });

            it('undefined or null values', async () => {
                try {
                    const badVisit = {
                        clientId: 8,
                        visitDay: null,
                        visitDateTime: null,
                    };
                    await clientService.addVisit(badVisit);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('empty param', async () => {
                try {
                    await clientService.get({});
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('null or undefined id', async () => {
                try {
                    await clientService.addVisit({ clientId: null });
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('id not integer', async () => {
                try {
                    await clientService.addVisit({ clientId: 'something' });
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_ID_NOT_INT');
                }
            });

            it('bad day', async () => {
                try {
                    const badVisit = {
                        clientId: 8,
                        visitDay: 9,
                        visitDateTime: '08-06-2021 15:30:00',
                    };
                    await clientService.addVisit(badVisit);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_BAD_DAY');
                }
            });

            it('bad datetime format', async () => {
                try {
                    const badVisit = {
                        clientId: 8,
                        visitDay: 6,
                        visitDateTime: '08-77-21 156:30:00',
                    };
                    clientService.addVisit(badVisit);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_BAD_DATETIME');
                }

                try {
                    const badVisit = {
                        clientId: 8,
                        visitDay: 6,
                        visitDateTime: '08-06-2021 15-30-00',
                    };
                    clientService.addVisit(badVisit);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_BAD_DATETIME');
                }
            });
        });

        describe('removeVisit', () => {
            it('null or undefined param', async () => {
                try {
                    await clientService.removeVisit(null);
                } catch (error) {
                    assert.isTrue(error instanceof TypeError);
                }
            });

            it('undefined or null values', async () => {
                try {
                    const badVisit = {
                        clientId: 8,
                        visitDay: null,
                        visitDateTime: null,
                    };
                    await clientService.removeVisit(badVisit);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('empty param', async () => {
                try {
                    await clientService.removeVisit({});
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('null or undefined id', async () => {
                try {
                    await clientService.removeVisit({ clientId: null });
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('id not integer', async () => {
                try {
                    await clientService.removeVisit({ clientId: 'something' });
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_ID_NOT_INT');
                }
            });

            it('bad day', async () => {
                try {
                    const badVisit = {
                        clientId: 8,
                        visitDay: 9,
                        visitDateTime: '08-06-2021 15:30:00',
                    };
                    await clientService.removeVisit(badVisit);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_BAD_DAY');
                }
            });

            it('bad datetime format', async () => {
                try {
                    const badVisit = {
                        clientId: 8,
                        visitDay: 6,
                        visitDateTime: '088-06-2021 155:30:00',
                    };
                    clientService.removeVisit(badVisit);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_BAD_DATETIME');
                }

                try {
                    const badVisit = {
                        clientId: 8,
                        visitDay: 6,
                        visitDateTime: '08-06-2021 15-30-00',
                    };
                    clientService.removeVisit(badVisit);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_BAD_DATETIME');
                }
            });

            it('visit not exists', async () => {
                const allclients = await clientService.getAll();
                const client = allclients[allclients.length - 1];
                const inexistentVisit = {
                    clientId: client.id,
                    visitDay: 3,
                    visitDateTime: '08-06-2021 15:30:00',
                };
                const result = await clientService.removeVisit(inexistentVisit);
                assert.strictEqual(result.affectedRows, 0);
            });
        });
    });
});
