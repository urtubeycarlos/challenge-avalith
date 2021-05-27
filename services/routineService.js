const mongoDB = require('../mongo.db');
const { checkID } = require('../utils/checkers');

async function getAll() {
    const [db, client] = await mongoDB;
    return new Promise((resolve, reject) => {
        db.collection('routines').find({}).toArray((error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
        client.close();
    });
}

async function get(clientId) {
    checkID(clientId);
    const [db, client] = await mongoDB;
    return new Promise((resolve, reject) => {
        db.collection('routines').findOne({ client_id: clientId }, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
        client.close();
    });
}

async function insert(routine) {
    checkID(routine.client_id);
    const [db, client] = await mongoDB;
    return new Promise((resolve, reject) => {
        db.collection('routines').insert(routine, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
        client.close();
    });
}

async function update(routine) {
    checkID(routine.client_id);
    const [db, client] = await mongoDB;
    return new Promise((resolve, reject) => {
        const query = { client_id: routine.client_id };
        db.collection('routines').updateOne(query, routine, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
        client.close();
    });
}

async function remove(clientId) {
    checkID(clientId);
    const [db, client] = await mongoDB;
    return new Promise((resolve, reject) => {
        const query = { client_id: clientId };
        db.collection('routines').deleteOne(query, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
        client.close();
    });
}

module.exports = {
    getAll,
    get,
    insert,
    update,
    remove,
};
