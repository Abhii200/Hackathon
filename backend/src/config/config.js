require('dotenv').config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'e0c7c9982d16c45b342d26d96b66ea306cd5c75863d32960983857f25d411d6f57b34566682b897d2dd069f953bf997600404e3b867724ec23c8ee1675aaf834', // Ensure this is stored securely
    dbConfig: {
        connectionString: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5430/hosp_db'
    }
};
