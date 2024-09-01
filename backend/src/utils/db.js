const { Client } = require('pg');
const { dbConfig } = require('../config/config');

const client = new Client(dbConfig);

client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Database connection error:', err.stack));

module.exports = client;
