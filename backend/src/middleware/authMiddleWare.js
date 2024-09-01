const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).send('Access Denied: No Token Provided');
    }

    try {
        const verified = jwt.verify(token, jwtSecret);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

module.exports = authenticateToken;
