const { describe, it } = require('mocha');
const { beforeEach, afterEach } = require('mocha');
const { assert } = require('chai');
const gymEquipmentService = require('../../services/gymEquipmentService');

describe.only('Testing gym equipment service', () => {
    const equipments = [
        {
            name: 'Bicicleta 1',
            brand: 'Philco',
            type: 'Bicicleta',
            model: 'B-900',
        },
        {
            name: 'Bicicleta 2',
            brand: 'Mountain',
            type: 'Bicicleta',
            model: 'BC-780',
        },
    ];

    beforeEach(async () => {
        for (let i = 0; i < equipments.length; i += 1) {
            const equipment = equipments[i];
            await gymEquipmentService.insert(equipment);
        }
    });

    afterEach(async () => {
        const result = await gymEquipmentService.getAll();
        for (let i = 0; i < result.length; i += 1) {
            const equipment = result[i];
            await gymEquipmentService.remove(equipment.id);
        }
    });

    describe('main methods', () => {
        it('getAll', async () => {
            const result = await gymEquipmentService.getAll();
            assert.strictEqual(result.length, 2);
        });

        it('get', async () => {
            const all = await gymEquipmentService.getAll();
            const result = await gymEquipmentService.get(all[0].id);
            assert.deepEqual(result, all[0]);
        });

        it('insert', async () => {
            const anotherEquipment = {
                name: 'Elíptica 1',
                brand: 'World Fitness',
                type: 'Elíptica',
                model: 'E-T800',
            };
            await gymEquipmentService.insert(anotherEquipment);
            const all = await gymEquipmentService.getAll();
            assert.strictEqual(all.length, 3);
        });

        it('remove', async () => {
            let all = await gymEquipmentService.getAll();
            await gymEquipmentService.remove(all[0].id);
            all = await gymEquipmentService.getAll();
            assert.strictEqual(all.length, 1);
        });

        it('update', async () => {
            const all = await gymEquipmentService.getAll();
            const newStatus = 2;
            await gymEquipmentService.update(all[0].id, newStatus);
            const oneUpdated = await gymEquipmentService.get(all[0].id);
            assert.strictEqual(oneUpdated.status, 'out of service');
        });
    });

    describe('border cases', () => {
        describe('getAll', () => {
            it('empty result', async () => {
                const all = await gymEquipmentService.getAll();
                for (let i = 0; i < all.length; i += 1) {
                    const equipment = all[i];
                    await gymEquipmentService.remove(equipment.id);
                }
                const result = await gymEquipmentService.getAll();
                assert.strictEqual(result.length, 0);
            });
        });

        describe('get', () => {
            it('null or undefined id', async () => {
                try {
                    await gymEquipmentService.get(null);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('not integer id', async () => {
                try {
                    await gymEquipmentService.get('something');
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_ID_NOT_INT');
                }
            });

            it('equipment not exists', async () => {
                const all = await gymEquipmentService.getAll();
                const lastId = all[all.length - 1].id;
                const result = await gymEquipmentService.get(lastId + 1);
                assert.deepEqual(result, {});
            });
        });

        describe('remove', () => {
            it('null or undefined id', async () => {
                try {
                    await gymEquipmentService.remove(null);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('not integer id', async () => {
                try {
                    await gymEquipmentService.remove('something');
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_ID_NOT_INT');
                }
            });

            it('equipment not exists', async () => {
                const all = await gymEquipmentService.getAll();
                const lastId = all[all.length - 1].id;
                const result = await gymEquipmentService.remove(lastId + 1);
                assert.strictEqual(result.affectedRows, 0);
            });
        });

        describe('insert', () => {
            it('null or undefined param', async () => {
                try {
                    await gymEquipmentService.insert(null);
                } catch (error) {
                    assert.isTrue(error instanceof TypeError);
                }
            });

            it('null or undefined values', async () => {
                const invalid = {
                    name: null,
                    brand: undefined,
                    type: null,
                    model: undefined,
                };
                try {
                    await gymEquipmentService.insert(invalid);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('duplicated name', async () => {
                const duplicated = {
                    name: 'Bicicleta 1',
                    brand: 'Philco',
                    type: 'Bicicleta',
                    model: 'B-900',
                };
                try {
                    await gymEquipmentService.insert(duplicated);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_DUP_ENTRY');
                }
            });
        });

        describe('update', () => {
            it('null or undefined id', async () => {
                try {
                    await gymEquipmentService.update(undefined, null);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('not integer id', async () => {
                try {
                    await gymEquipmentService.update('something', null);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_ID_NOT_INT');
                }
            });

            it('null or undefined status', async () => {
                try {
                    await gymEquipmentService.update(1, null);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('bad status', async () => {
                try {
                    const badStatus = 5;
                    await gymEquipmentService.update(1, badStatus);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_BAD_STATUS');
                }
            });

            it('equipment not exists', async () => {
                const all = await gymEquipmentService.getAll();
                const lastId = all[all.length - 1].id;
                const result = await gymEquipmentService.update(lastId + 1, 2);
                assert.strictEqual(result.affectedRows, 0);
            });
        });
    });
});
