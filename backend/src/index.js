// src/index.js

require('dotenv').config();
const express = require('express');
const setupDatabase = require('./setUpDatabase');
const hospitalRoutes = require('./routes/hospital');

const app = express();
const port = process.env.PORT || 5000;

// Route to setup the database
// app.get('/setup-database', async (req, res) => {
//     try {
//         await setupDatabase();
//         res.send('Database setup complete!');
//     } catch (error) {
//         res.status(500).send('Error setting up the database.');
//     }
// });

// Use hospital routes
app.use('/api', hospitalRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
