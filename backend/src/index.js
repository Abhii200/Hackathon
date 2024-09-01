const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:password@localhost:5430/hosp_db' 
});

client.connect()
    .then(() => {
        console.log('Connected to PostgreSQL!'); 
    })
    
