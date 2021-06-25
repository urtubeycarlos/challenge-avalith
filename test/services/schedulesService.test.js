const { describe, it } = require('mocha');
const { beforeEach, afterEach } = require('mocha');
const { assert } = require('chai');
const userService = require('../../services/userService');
const schedulesService = require('../../services/schedulesService');

describe('Testing professor service', () => {
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
        const all = await userService.getAll('professor');
        for (let i = 0; i < all.length; i += 1) {
            const professor = all[i];
            for (let j = 0; j < fakeSchedules.length; j += 1) {
                const schedule = fakeSchedules[j];
                schedule.professorId = professor.id;
                await schedulesService.addSchedule(schedule);
            }
        }
    });

    afterEach(async () => {
        for (let i = 0; i < fakeProfessors.length; i += 1) {
            const professor = fakeProfessors[i];
            await userService.remove(professor);
        }
        const schedules = await schedulesService.getSchedules();
        for (let i = 0; i < schedules.length; i += 1) {
            const schedule = schedules[i];
            await schedulesService.removeSchedule(schedule);
        }
    });

    describe('main methods', () => {
        it('getSchedules', async () => {
            const all = await schedulesService.getSchedules();
            assert.strictEqual(all.length, 2);
        });

        it('getSchedule', async () => {
            const allProfessors = await userService.getAll('professor');
            const professor = allProfessors[allProfessors.length - 1];
            const result = await schedulesService.getSchedule(professor.id);
            assert.strictEqual(result.length, 2);
        });

        it('addSchedule', async () => {
            const allProfessors = await userService.getAll('professor');
            const professor = allProfessors[allProfessors.length - 1];
            const newSchedule = {
                professorId: professor.id,
                day: 5,
                startHour: '17:30:00',
                finishHour: '19:00:00',
            };
            await schedulesService.addSchedule(newSchedule);
            const result = await schedulesService.getSchedule(professor.id);
            assert.strictEqual(result.length, 3);
        });

        it('removeSchedule', async () => {
            const oneSchedule = fakeSchedules[0];
            const allProfessors = await userService.getAll('professor');
            const professor = allProfessors[allProfessors.length - 1];
            oneSchedule.professorId = professor.id;
            await schedulesService.removeSchedule(oneSchedule);
            const result = await schedulesService.getSchedule(professor.id);
            assert.strictEqual(result.length, 1);
        });
    });

    describe('border cases', () => {
        describe('getSchedules', () => {
            it('empty result', async () => {
                let schedules = await schedulesService.getSchedules();
                for (let i = 0; i < schedules.length; i += 1) {
                    const schedule = schedules[i];
                    await schedulesService.removeSchedule(schedule);
                }
                schedules = await schedulesService.getSchedules();
                assert.strictEqual(schedules.length, 0);
            });
        });

        describe('getSchedule', () => {
            it('null or undefined id', async () => {
                try {
                    await schedulesService.getSchedule(null);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('id not integer', async () => {
                try {
                    await schedulesService.getSchedule('something');
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_ID_NOT_INT');
                }
            });

            it('professor not exists', async () => {
                const allProfessors = await userService.getAll('professor');
                const professor = allProfessors[allProfessors.length - 1];
                const result = await schedulesService.getSchedule(professor.id + 1);
                assert.strictEqual(result.length, 0);
            });
        });

        describe('addSchedule', () => {
            it('null or undefined param', async () => {
                try {
                    await schedulesService.addSchedule(null);
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
                    await schedulesService.addSchedule(badSchedule);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('empty param', async () => {
                try {
                    await schedulesService.addSchedule({});
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('null or undefined id', async () => {
                try {
                    await schedulesService.addSchedule({ professorId: null });
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('id not integer', async () => {
                try {
                    await schedulesService.addSchedule({ professorId: 'something' });
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
                    await schedulesService.addSchedule(badSchedule);
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
                    schedulesService.addSchedule(badSchedule);
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
                    schedulesService.addSchedule(badSchedule);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_BAD_TIME');
                }
            });
        });

        describe('removeSchedule', () => {
            it('null or undefined param', async () => {
                try {
                    await schedulesService.removeSchedule(null);
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
                    await schedulesService.removeSchedule(badSchedule);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('empty param', async () => {
                try {
                    await schedulesService.removeSchedule({});
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('null or undefined id', async () => {
                try {
                    await schedulesService.removeSchedule({ professorId: null });
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('id not integer', async () => {
                try {
                    await schedulesService.removeSchedule({ professorId: 'something' });
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
                    await schedulesService.removeSchedule(badSchedule);
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
                    schedulesService.removeSchedule(badSchedule);
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
                    schedulesService.removeSchedule(badSchedule);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_BAD_TIME');
                }
            });

            it('schedule not exists', async () => {
                const allProfessors = await userService.getAll('professor');
                const professor = allProfessors[allProfessors.length - 1];
                const inexistentSchedule = {
                    professorId: professor.id,
                    day: 3,
                    startHour: '14:30:00',
                    finishHour: '17:45:00',
                };
                const result = await schedulesService.removeSchedule(inexistentSchedule);
                assert.strictEqual(result.affectedRows, 0);
            });
        });
    });
});
