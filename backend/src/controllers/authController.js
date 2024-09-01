const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const client = require('../utils/db');
const { jwtSecret } = require('../config/config');

// Register a new user
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send('Name, email, and password are required');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await client.query(
            `INSERT INTO users (name, email, password)
             VALUES ($1, $2, $3)`,
            [name, email, hashedPassword]
        );
        res.status(201).send('User registered successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering user');
    }
};

// Login a user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    try {
        const result = await client.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(400).send('User not found');
        }

        const isMatch = await bcrypt.compare(password, result.rows[0].password);

        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        const token = jwt.sign(
            { id: result.rows[0].id, email: result.rows[0].email },
            jwtSecret,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
};
