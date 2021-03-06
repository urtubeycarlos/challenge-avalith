const { describe, it } = require('mocha');
const { beforeEach, afterEach } = require('mocha');
const { assert } = require('chai');
const userService = require('../../services/userService');
const visitsService = require('../../services/visitsService');

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
        const clients = await userService.getAll('client');
        for (let i = 0; i < clients.length; i += 1) {
            const client = clients[i];
            for (let j = 0; j < fakeVisits.length; j += 1) {
                const visit = fakeVisits[j];
                visit.clientId = client.id;
                await visitsService.addVisit(visit);
            }
        }
    });

    afterEach(async () => {
        for (let i = 0; i < fakeClients.length; i += 1) {
            const client = fakeClients[i];
            await userService.remove(client);
        }
        const visits = await visitsService.getAllVisits();
        for (let i = 0; i < visits.length; i += 1) {
            const visit = visits[i];
            visitsService.removeVisit(visit);
        }
    });

    describe('main methods', () => {
        it('getAllVisits', async () => {
            const allVisits = await visitsService.getAllVisits();
            assert.strictEqual(allVisits.length, 2);
        });

        it('getClientVisits', async () => {
            const allClients = await userService.getAll('client');
            const client = allClients[allClients.length - 1];
            const result = await visitsService.getClientVisits(client.id);
            assert.strictEqual(result.length, 2);
        });

        it('addVisit', async () => {
            const allClients = await userService.getAll('client');
            const client = allClients[allClients.length - 1];
            const newVisit = {
                clientId: client.id,
                visitDay: 4,
                visitDateTime: '08-06-2021 15:30:00',
            };
            await visitsService.addVisit(newVisit);
            const result = await visitsService.getAllVisits();
            assert.strictEqual(result.length, 3);
        });

        it('removeVisit', async () => {
            const visit = fakeVisits[0];
            const allClients = await userService.getAll('client');
            const client = allClients[allClients.length - 1];
            visit.clientId = client.id;
            await visitsService.removeVisit(visit);
            const result = await visitsService.getAllVisits();
            assert.strictEqual(result.length, 1);
        });
    });

    describe('border cases', () => {
        describe('getAllVisits', () => {
            it('empty result', async () => {
                const clients = await userService.getAll('client');
                for (let i = 0; i < clients.length; i += 1) {
                    const client = clients[i];
                    for (let j = 0; j < fakeVisits.length; j += 1) {
                        const visit = fakeVisits[j];
                        visit.clientId = client.id;
                        await visitsService.removeVisit(visit);
                    }
                }
                const result = await visitsService.getAllVisits();
                assert.strictEqual(result.length, 0);
            });
        });

        describe('getClientVisits', () => {
            it('null or undefined id', async () => {
                try {
                    await visitsService.getClientVisits(null);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('not integer id', async () => {
                try {
                    await visitsService.getClientVisits('something');
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_ID_NOT_INT');
                }
            });

            it('empty result and not existing client', async () => {
                const clients = await userService.getAll('client');
                const client = clients[clients.length - 1];
                const result = await visitsService.getClientVisits(client.id + 1);
                assert.strictEqual(result.length, 0);
            });
        });

        describe('addVisit', () => {
            it('null or undefined param', async () => {
                try {
                    await visitsService.addVisit(null);
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
                    await visitsService.addVisit(badVisit);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('empty param', async () => {
                try {
                    await visitsService.addVisit({});
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('null or undefined id', async () => {
                try {
                    await visitsService.addVisit({ clientId: null });
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('id not integer', async () => {
                try {
                    await visitsService.addVisit({ clientId: 'something' });
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
                    await visitsService.addVisit(badVisit);
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
                    visitsService.addVisit(badVisit);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_BAD_DATETIME');
                }

                try {
                    const badVisit = {
                        clientId: 8,
                        visitDay: 6,
                        visitDateTime: '08-06-2021 15-30-00',
                    };
                    visitsService.addVisit(badVisit);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_BAD_DATETIME');
                }
            });
        });

        describe('removeVisit', () => {
            it('null or undefined param', async () => {
                try {
                    await visitsService.removeVisit(null);
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
                    await visitsService.removeVisit(badVisit);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('empty param', async () => {
                try {
                    await visitsService.removeVisit({});
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('null or undefined id', async () => {
                try {
                    await visitsService.removeVisit({ clientId: null });
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('id not integer', async () => {
                try {
                    await visitsService.removeVisit({ clientId: 'something' });
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
                    await visitsService.removeVisit(badVisit);
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
                    visitsService.removeVisit(badVisit);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_BAD_DATETIME');
                }

                try {
                    const badVisit = {
                        clientId: 8,
                        visitDay: 6,
                        visitDateTime: '08-06-2021 15-30-00',
                    };
                    visitsService.removeVisit(badVisit);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_BAD_DATETIME');
                }
            });

            it('visit not exists', async () => {
                const allclients = await userService.getAll('client');
                const client = allclients[allclients.length - 1];
                const inexistentVisit = {
                    clientId: client.id,
                    visitDay: 3,
                    visitDateTime: '08-06-2021 15:30:00',
                };
                const result = await visitsService.removeVisit(inexistentVisit);
                assert.strictEqual(result.affectedRows, 0);
            });
        });
    });
});
