const { describe, it } = require('mocha');
const { beforeEach, afterEach } = require('mocha');
const { assert } = require('chai');
const userService = require('../../services/userService');
const professorSchedulesService = require('../../services/professorSchedulesService');

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
                await professorSchedulesService.addSchedule(schedule);
            }
        }
    });

    afterEach(async () => {
        for (let i = 0; i < fakeProfessors.length; i += 1) {
            const professor = fakeProfessors[i];
            await userService.remove(professor);
        }
        const schedules = await professorSchedulesService.getSchedules();
        for (let i = 0; i < schedules.length; i += 1) {
            const schedule = schedules[i];
            await professorSchedulesService.removeSchedule(schedule);
        }
    });

    describe('main methods', () => {
        it('getSchedules', async () => {
            const all = await professorSchedulesService.getSchedules();
            assert.strictEqual(all.length, 2);
        });

        it('getSchedule', async () => {
            const allProfessors = await userService.getAll('professor');
            const professor = allProfessors[allProfessors.length - 1];
            const result = await professorSchedulesService.getSchedule(professor.id);
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
            await professorSchedulesService.addSchedule(newSchedule);
            const result = await professorSchedulesService.getSchedule(professor.id);
            assert.strictEqual(result.length, 3);
        });

        it('removeSchedule', async () => {
            const oneSchedule = fakeSchedules[0];
            const allProfessors = await userService.getAll('professor');
            const professor = allProfessors[allProfessors.length - 1];
            oneSchedule.professorId = professor.id;
            await professorSchedulesService.removeSchedule(oneSchedule);
            const result = await professorSchedulesService.getSchedule(professor.id);
            assert.strictEqual(result.length, 1);
        });
    });

    describe('border cases', () => {
        describe('getSchedules', () => {
            it('empty result', async () => {
                let schedules = await professorSchedulesService.getSchedules();
                for (let i = 0; i < schedules.length; i += 1) {
                    const schedule = schedules[i];
                    await professorSchedulesService.removeSchedule(schedule);
                }
                schedules = await professorSchedulesService.getSchedules();
                assert.strictEqual(schedules.length, 0);
            });
        });

        describe('getSchedule', () => {
            it('null or undefined id', async () => {
                try {
                    await professorSchedulesService.getSchedule(null);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('id not integer', async () => {
                try {
                    await professorSchedulesService.getSchedule('something');
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_ID_NOT_INT');
                }
            });

            it('professor not exists', async () => {
                const allProfessors = await userService.getAll('professor');
                const professor = allProfessors[allProfessors.length - 1];
                const result = await professorSchedulesService.getSchedule(professor.id + 1);
                assert.strictEqual(result.length, 0);
            });
        });

        describe('addSchedule', () => {
            it('null or undefined param', async () => {
                try {
                    await professorSchedulesService.addSchedule(null);
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
                    await professorSchedulesService.addSchedule(badSchedule);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('empty param', async () => {
                try {
                    await professorSchedulesService.addSchedule({});
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('null or undefined id', async () => {
                try {
                    await professorSchedulesService.addSchedule({ professorId: null });
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('id not integer', async () => {
                try {
                    await professorSchedulesService.addSchedule({ professorId: 'something' });
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
                    await professorSchedulesService.addSchedule(badSchedule);
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
                    professorSchedulesService.addSchedule(badSchedule);
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
                    professorSchedulesService.addSchedule(badSchedule);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_BAD_TIME');
                }
            });
        });

        describe('removeSchedule', () => {
            it('null or undefined param', async () => {
                try {
                    await professorSchedulesService.removeSchedule(null);
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
                    await professorSchedulesService.removeSchedule(badSchedule);
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_PARAM');
                }
            });

            it('empty param', async () => {
                try {
                    await professorSchedulesService.removeSchedule({});
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('null or undefined id', async () => {
                try {
                    await professorSchedulesService.removeSchedule({ professorId: null });
                } catch (error) {
                    assert.strictEqual(error.code, 'ER_NOT_ID');
                }
            });

            it('id not integer', async () => {
                try {
                    await professorSchedulesService.removeSchedule({ professorId: 'something' });
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
                    await professorSchedulesService.removeSchedule(badSchedule);
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
                    professorSchedulesService.removeSchedule(badSchedule);
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
                    professorSchedulesService.removeSchedule(badSchedule);
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
                const result = await professorSchedulesService.removeSchedule(inexistentSchedule);
                assert.strictEqual(result.affectedRows, 0);
            });
        });
    });
});
