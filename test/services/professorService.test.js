const { describe, it } = require('mocha');
const { beforeEach, afterEach } = require('mocha');
const { assert } = require('chai');
const userService = require('../../services/userService');
const professorService = require('../../services/professorService');

describe.only('Testing professor service', () => {
    const fakeProfessors = [
        {
            name: 'John',
            surname: 'Doe',
            email: 'john.doe@gmail.com',
            password: '1234',
            role: 2,
        },
    ];

    const fakeSchedules = [
        {
            day: 1,
            startHour: '15:00:00',
            finishHour: '16:00:00',
        },
        {
            day: 2,
            startHour: '09:00:00',
            finishHour: '12:00:00',
        },
    ];

    beforeEach(async () => {
        for (let i = 0; i < fakeProfessors.length; i += 1) {
            const professor = fakeProfessors[i];
            await userService.insert(professor);
        }
        const all = await professorService.getAll();
        for (let i = 0; i < all.length; i += 1) {
            const professor = all[i];
            for (let j = 0; j < fakeSchedules.length; j += 1) {
                const schedule = fakeSchedules[j];
                schedule.professorId = professor.id;
                await professorService.addSchedule(schedule);
            }
        }
    });

    afterEach(async () => {
        for (let i = 0; i < fakeProfessors.length; i += 1) {
            const professor = fakeProfessors[i];
            await userService.remove(professor);
        }
        const schedules = await professorService.getSchedules();
        for (let i = 0; i < schedules.length; i += 1) {
            const schedule = schedules[i];
            await professorService.removeSchedule(schedule);
        }
    });

    describe('main methods', () => {
        it('getAll', async () => {
            const result = await professorService.getAll();
            assert.strictEqual(result.length, 1);
        });

        it('get', async () => {
            const all = await professorService.getAll();
            const one = all[all.length - 1];
            const result = await professorService.get(one);
            assert.deepEqual(result, one);
        });

        it('getSchedules', async () => {
            const all = await professorService.getSchedules();
            assert.strictEqual(all.length, 2);
        });

        it('getSchedule', async () => {
            const allProfessors = await professorService.getAll();
            const oneProfessor = allProfessors[allProfessors.length - 1];
            const result = await professorService.getSchedule(oneProfessor.id);
            assert.strictEqual(result.length, 2);
        });

        it('addSchedule', async () => {
            const allProfessors = await professorService.getAll();
            const oneProfessor = allProfessors[allProfessors.length - 1];
            const newSchedule = {
                professorId: oneProfessor.id,
                day: 5,
                startHour: '17:30:00',
                finishHour: '19:00:00',
            };
            await professorService.addSchedule(newSchedule);
            const result = await professorService.getSchedule(oneProfessor.id);
            assert.strictEqual(result.length, 3);
        });

        it('removeSchedule', async () => {
            const oneSchedule = fakeSchedules[0];
            const allProfessors = await professorService.getAll();
            const oneProfessor = allProfessors[allProfessors.length - 1];
            oneSchedule.professorId = oneProfessor.id;
            await professorService.removeSchedule(oneSchedule);
            const result = await professorService.getSchedule(oneProfessor.id);
            assert.strictEqual(result.length, 1);
        });
    });

    describe('border cases', () => {
        describe('getAll', () => {
            it('empty result', async () => {
                for (let i = 0; i < fakeProfessors.length; i += 1) {
                    const professor = fakeProfessors[i];
                    await userService.remove(professor);
                }
                const allProfessors = await professorService.getAll();
                assert.strictEqual(allProfessors.length, 0);
            });
        });

        describe('get', () => {
            it('null or undefined param', async () => {
                try {
                    await professorService.get(null);
                } catch (error) {
                    assert.isTrue(error instanceof TypeError);
                }
            });

            it('undefined or null values', async () => {
                try {
                    await professorService.get({ email: null, password: undefined });
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('empty param', async () => {
                try {
                    await professorService.get({});
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('professor not exists', async () => {
                const inexistentProfessor = {
                    email: 'erik@coldmail.com',
                    password: '5678',
                };
                const result = await userService.get(inexistentProfessor);
                assert.deepEqual(result, {});
            });
        });

        describe('getSchedules', () => {
            it('empty result', async () => {
                let schedules = await professorService.getSchedules();
                for (let i = 0; i < schedules.length; i += 1) {
                    const schedule = schedules[i];
                    await professorService.removeSchedule(schedule);
                }
                schedules = await professorService.getSchedules();
                assert.strictEqual(schedules.length, 0);
            });
        });

        describe('getSchedule', () => {
            it('null or undefined id', async () => {
                try {
                    await professorService.getSchedule(null);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('id not integer', async () => {
                try {
                    await professorService.getSchedule('something');
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_ID_NOT_INT');
                }
            });

            it('professor not exists', async () => {
                const allProfessors = await professorService.getAll();
                const oneProfessor = allProfessors[allProfessors.length - 1];
                const result = await professorService.getSchedule(oneProfessor.id + 1);
                assert.strictEqual(result.length, 0);
            });
        });

        describe('addSchedule', () => {
            it('null or undefined param', async () => {
                try {
                    await professorService.addSchedule(null);
                } catch (error) {
                    assert.isTrue(error instanceof TypeError);
                }
            });

            it('undefined or null values', async () => {
                try {
                    const badSchedule = {
                        professorId: 8,
                        day: null,
                        startHour: null,
                        finishHour: null,
                    };
                    await professorService.addSchedule(badSchedule);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('empty param', async () => {
                try {
                    await professorService.get({});
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('null or undefined id', async () => {
                try {
                    await professorService.addSchedule({ professorId: null });
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('id not integer', async () => {
                try {
                    await professorService.addSchedule({ professorId: 'something' });
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_ID_NOT_INT');
                }
            });

            it('bad day', async () => {
                try {
                    const badSchedule = {
                        professorId: 8,
                        day: 9,
                        startHour: '17:30:00',
                        finishHour: '19:00:00',
                    };
                    await professorService.addSchedule(badSchedule);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_BAD_DAY');
                }
            });

            it('bad hour format', async () => {
                try {
                    const badSchedule = {
                        professorId: 8,
                        day: 6,
                        startHour: '177:30:00',
                        finishHour: '199:00:00',
                    };
                    professorService.addSchedule(badSchedule);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_BAD_TIME');
                }

                try {
                    const badSchedule = {
                        professorId: 8,
                        day: 6,
                        startHour: '17-30-00',
                        finishHour: '19-00-00',
                    };
                    professorService.addSchedule(badSchedule);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_BAD_TIME');
                }
            });
        });

        describe('removeSchedule', () => {
            it('null or undefined param', async () => {
                try {
                    await professorService.removeSchedule(null);
                } catch (error) {
                    assert.isTrue(error instanceof TypeError);
                }
            });

            it('undefined or null values', async () => {
                try {
                    const badSchedule = {
                        professorId: 8,
                        day: null,
                        startHour: null,
                        finishHour: null,
                    };
                    await professorService.removeSchedule(badSchedule);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('empty param', async () => {
                try {
                    await professorService.get({});
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('null or undefined id', async () => {
                try {
                    await professorService.removeSchedule({ professorId: null });
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('id not integer', async () => {
                try {
                    await professorService.removeSchedule({ professorId: 'something' });
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_ID_NOT_INT');
                }
            });

            it('bad day', async () => {
                try {
                    const badSchedule = {
                        professorId: 8,
                        day: 9,
                        startHour: '17:30:00',
                        finishHour: '19:00:00',
                    };
                    await professorService.removeSchedule(badSchedule);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_BAD_DAY');
                }
            });

            it('bad hour format', async () => {
                try {
                    const badSchedule = {
                        professorId: 8,
                        day: 6,
                        startHour: '177:30:00',
                        finishHour: '199:00:00',
                    };
                    professorService.removeSchedule(badSchedule);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_BAD_TIME');
                }

                try {
                    const badSchedule = {
                        professorId: 8,
                        day: 6,
                        startHour: '17-30-00',
                        finishHour: '19-00-00',
                    };
                    professorService.removeSchedule(badSchedule);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_BAD_TIME');
                }
            });

            it('schedule not exists', async () => {
                const allProfessors = await professorService.getAll();
                const oneProfessor = allProfessors[allProfessors.length - 1];
                const inexistentSchedule = {
                    professorId: oneProfessor.id,
                    day: 3,
                    startHour: '14:30:00',
                    finishHour: '17:45:00',
                };
                const result = await professorService.removeSchedule(inexistentSchedule);
                assert.strictEqual(result.affectedRows, 0);
            });
        });
    });
});
