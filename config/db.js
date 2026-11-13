const fs = require('fs');
const mysql = require('mysql2/promise');

let ssl;

if (process.env.DB_SSL === 'true') {
    if (!process.env.SSL_CA) {
        throw new Error('DB_SSL is true, but SSL_CA is not configured.');
    }

    ssl = {
        ca: fs.readFileSync(process.env.SSL_CA, 'utf8'),
        rejectUnauthorized: true
    };
}

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
    queueLimit: 0,

    enableKeepAlive: true,
    keepAliveInitialDelay: 0,

    ...(ssl ? { ssl } : {})
});

// Verify the database without keeping a connection checked out.
db.verify = async function verify() {
    const connection = await db.getConnection();

    try {
        await connection.ping();
    } finally {
        connection.release();
    }
};

module.exports = db;