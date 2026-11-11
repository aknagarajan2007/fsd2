
require('dotenv').config();

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const sslEnabled = process.env.DB_SSL === 'true';

const dbConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Enable SSL only for Aiven
if (sslEnabled) {
    if (!process.env.SSL_CA) {
        throw new Error('SSL_CA is missing in .env');
    }

    const caPath = path.resolve(process.cwd(), process.env.SSL_CA);

    dbConfig.ssl = {
        ca: fs.readFileSync(caPath),
        rejectUnauthorized: true
    };
}

const db = mysql.createPool(dbConfig);

// Test connection
(async () => {
    try {
        const connection = await db.getConnection();

        console.log(
            sslEnabled
                ? 'Aiven MySQL Connected Successfully (SSL)'
                : 'Localhost MySQL Connected Successfully'
        );

        connection.release();

    } catch (err) {
        console.error('MySQL Connection Error:', err.message);
    }
})();

module.exports = db;
