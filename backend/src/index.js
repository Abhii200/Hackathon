// src/index.js

require('dotenv').config();
const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser'); 
const crypto = require('crypto');
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointment');
const hospitalRoutes = require('./routes/hospital');

// Create a new Express application
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// PostgreSQL client configuration
const client = new Client({
    connectionString: process.env.DATABASE_URL // Make sure to set DATABASE_URL in .env
});


// Route to setup the database
// app.get('/setup-database', async (req, res) => {
//     try {
//         await setupDatabase();
//         res.send('Database setup complete!');
//     } catch (error) {
//         res.status(500).send('Error setting up the database.');
//     }
// });
// Routes
app.use('/users', authRoutes);


// Use hospital routes
app.use('/api', hospitalRoutes,appointmentRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Uncomment this if you need to generate a secret key
// const secretKey = crypto.randomBytes(64).toString('hex');
// console.log(secretKey);