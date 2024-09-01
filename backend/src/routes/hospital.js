// src/routes/hospitalRoutes.js

const express = require('express');
const router = express.Router();
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL!'))
    .catch((err) => console.error('Connection error', err.stack));

// Fetch hospitals by location
router.get('/hospitals/:location', async (req, res) => {
    const { location } = req.params;
    
    try {
        const result = await client.query('SELECT * FROM hospitals WHERE location = $1', [location]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).send('Error fetching hospitals.');
    }
});

// Fetch specialties by hospitalId
router.get('/hospitals/:hospitalId/specialties', async (req, res) => {
    const { hospitalId } = req.params;

    console.log(`Fetching specialties for hospitalId: ${hospitalId}`);

    if (!hospitalId) {
        return res.status(400).send('Hospital ID is required.');
    }

    try {
        const result = await client.query(
            `SELECT DISTINCT speciality
             FROM doctors
             WHERE hospital_id = $1`,
            [hospitalId]
        );

        if (result.rows.length === 0) {
            return res.status(404).send('No specialties found for this hospital.');
        }

        console.log('Specialties retrieved:', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching specialties:', error);
        res.status(500).send('Error fetching specialties.');
    }
});

// Fetch doctors by hospitalId and specialty
router.get('/hospitals/:hospitalId/:speciality/doctors', async (req, res) => {
    const { hospitalId, speciality } = req.params;

    if (!hospitalId || !speciality) {
        return res.status(400).send('Hospital ID and Speciality are required.');
    }

    try {
        const result = await client.query(
            `SELECT *
             FROM doctors
             WHERE hospital_id = $1 AND speciality = $2`,
            [hospitalId, speciality]
        );

        if (result.rows.length === 0) {
            return res.status(404).send('No doctors found for this hospital and speciality.');
        }
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).send('Error fetching doctors.');
    }
});


module.exports = router;
