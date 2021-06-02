const { MongoClient } = require('mongodb');
require('dotenv').config();

let env = process.env.NODE_ENV;

let MONGO_HOST;
let MONGO_PORT;
let MONGO_DB;

if (env) {
    env = env.toUpperCase();
    MONGO_HOST = process.env[`MONGO_HOST_${env}`];
    MONGO_PORT = process.env[`MONGO_PORT_${env}`];
    MONGO_DB = process.env[`MONGO_DB_${env}`];
} else {
    MONGO_HOST = process.env.MONGO_HOST;
    MONGO_PORT = process.env.MONGO_PORT;
    MONGO_DB = process.env.MONGO_DB;
}

const connectionURL = `mongodb://${MONGO_HOST}:${MONGO_PORT}`;

function connection() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {
            if (error) {
                return reject(error);
            }
            const db = client.db(MONGO_DB);
            return resolve([db, client]);
        });
    });
}

module.exports = connection;
