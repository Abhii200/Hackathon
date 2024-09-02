const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const client = require('../utils/db');
const { jwtSecret } = require('../config/config');
const { sendMail } = require('../utils/mail');
const twilio = require('twilio');

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Twilio Auth Token
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID; // Your Twilio Verify Service SID

const sms = new twilio(accountSid, authToken);



// Register a new user
exports.registerUser = async (req, res) => {
    const { name, email, password, phone_number } = req.body;

    if (!name || !email || !password || !phone_number) {
        return res.status(400).send('Name, email, password, and phone number are required');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await client.query(
            `INSERT INTO users (name, email, password, phone_number)
             VALUES ($1, $2, $3, $4)`,
            [name, email, hashedPassword, phone_number]
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




// Forgot Password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send('Email is required');
    }

    try {
        // Query the database to check if the email exists
        const result = await client.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(400).send('User not found');
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Set OTP expiration time (e.g., 10 minutes from now)
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Store OTP and expiration time in the database
        await client.query(
            `UPDATE users SET otp = $1, otp_expires = $2 WHERE email = $3`,
            [otp, otpExpires, email]
        );

        // Send OTP via email
        await sendMail(email, 'Your OTP Code', `Your OTP code is ${otp}. It will expire in 10 minutes.`);

        res.status(200).send('OTP sent to your email address');
    } catch (err) {
        console.error('Error sending OTP:', err);
        res.status(500).send('Error sending OTP');
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).send('Email, OTP, and new password are required');
    }

    try {
        // Query the database to get the stored OTP and expiration time
        const result = await client.query(
            `SELECT otp, otp_expires FROM users WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(400).send('User not found');
        }

        const { otp: storedOtp, otp_expires: otpExpires } = result.rows[0];

        // Check if OTP is valid and not expired
        if (otp !== storedOtp) {
            return res.status(400).send('Invalid OTP');
        }

        if (new Date() > otpExpires) {
            return res.status(400).send('OTP has expired');
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password in the database
        await client.query(
            `UPDATE users SET password = $1, otp = NULL, otp_expires = NULL WHERE email = $2`,
            [hashedPassword, email]
        );

        res.status(200).send('Password reset successfully');
    } catch (err) {
        console.error('Error resetting password:', err);
        res.status(500).send('Error resetting password');
    }
};
