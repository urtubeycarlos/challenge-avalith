const { MongoClient } = require('mongodb');
require('dotenv').config();

const {
    MONGO_HOST,
    MONGO_PORT,
    MONGO_DB,
} = process.env;

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
