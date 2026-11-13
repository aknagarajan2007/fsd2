require('dotenv').config();

const app = require('./app');
const db = require('./config/db');
const mail = require('./config/mail');
const { COLOR, status, heading } = require('./utils/logger');

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
    heading('AK FABRICS SERVER');

    // Database check
    try {
        await db.verify();
        status('MYSQL', '● CONNECTED', COLOR.green);
    } catch (error) {
        status('MYSQL', '● FAILED', COLOR.red);
        console.error(`${COLOR.red}           ${error.message}${COLOR.reset}`);
        console.error(`${COLOR.red}Server startup stopped: database connection is required.${COLOR.reset}\n`);
        process.exitCode = 1;
        return;
    }

    // Email check
    try {
        await mail.verify();
        status('MAIL', '● CONNECTED', COLOR.green);
    } catch (error) {
        status('MAIL', '● FAILED', COLOR.red);
        console.error(`${COLOR.red}${error.message}${COLOR.reset}`);
        console.warn(`${COLOR.yellow}Email/OTP sending may not work until SMTP is fixed.${COLOR.reset}`);
    }

    // Start HTTP server
    const server = app.listen(PORT, () => {
        status('EXPRESS', '● RUNNING', COLOR.green);
        status('URL', `http://localhost:${PORT}`, COLOR.cyan);
        console.log(`\n==================================================\n`);
    });

    // Server error handler
    server.on('error', (error) => {
        status('SERVER', '● FAILED', COLOR.red);
        console.error(`${COLOR.red}${error.message}${COLOR.reset}`);
        process.exitCode = 1;
    });
}

startServer();