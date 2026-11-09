
const mysql = require('mysql2/promise');
const fs = require('fs');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: {
        ca: fs.readFileSync(process.env.SSL_CA),
        rejectUnauthorized: true
    },

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
(async () => {
    try {
        const connection = await db.getConnection();

        console.log('Aiven MySQL Connected Successfully');

        connection.release();
    } catch (err) {
        console.error('Aiven MySQL Error:', err.message);
    }
})();

module.exports = db;
