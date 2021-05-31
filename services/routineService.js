const mongoDB = require('../mongo.db');
const { checkID } = require('../utils/checkers');

async function getAll() {
    const [db, client] = await mongoDB();
    return new Promise((resolve, reject) => {
        db.collection('routines').find({}).toArray((error, result) => {
            client.close();
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

async function get(clientId) {
    checkID(clientId);
    const [db, client] = await mongoDB();
    return new Promise((resolve, reject) => {
        db.collection('routines').findOne({ client_id: Number.parseInt(clientId, 10) }, (error, result) => {
            client.close();
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

async function insert(routine) {
    checkID(routine.clientId);
    const existent = await get(routine.client_id);
    if (existent) {
        const error = new Error('client_id must be unique in db');
        error.code = 'ER_DUP_ENTRY';
        throw error;
    }
    const [db, client] = await mongoDB();
    return new Promise((resolve, reject) => {
        db.collection('routines').insertOne(routine, (error, result) => {
            client.close();
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

async function update(routine) {
    checkID(routine.clientId);
    const [db, client] = await mongoDB();
    return new Promise((resolve, reject) => {
        const query = { client_id: routine.client_id };
        db.collection('routines').updateOne(query, { $set: routine }, (error, result) => {
            client.close();
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

async function remove(clientId) {
    checkID(clientId);
    const [db, client] = await mongoDB();
    return new Promise((resolve, reject) => {
        const query = { client_id: Number.parseInt(clientId, 10) };
        db.collection('routines').deleteOne(query, (error, result) => {
            client.close();
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

module.exports = {
    getAll,
    get,
    insert,
    update,
    remove,
};
