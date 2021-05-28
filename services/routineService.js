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
        db.collection('routines').findOne({ client_id: clientId }, (error, result) => {
            client.close();
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

async function insert(routine) {
    checkID(routine.client_id);
    const [db, client] = await mongoDB();
    return new Promise((resolve, reject) => {
        db.collection('routines').insert(routine, (error, result) => {
            client.close();
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}

async function update(routine) {
    checkID(routine.client_id);
    const [db, client] = await mongoDB();
    return new Promise((resolve, reject) => {
        const query = { client_id: routine.client_id };
        db.collection('routines').updateOne(query, routine, (error, result) => {
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
        const query = { client_id: clientId };
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
