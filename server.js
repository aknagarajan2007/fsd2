require('dotenv').config();

const app = require('./app');
const db = require('./config/db');
const mail = require('./config/mail');
const { COLOR, status, heading } = require('./utils/logger');

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

function startServer() {
    heading('AK FABRICS SERVER');

    // 1. Start HTTP server IMMEDIATELY so Render detects the open port
    const server = app.listen(PORT, HOST, async () => {
        status('EXPRESS', '● RUNNING', COLOR.green);
        status('HOST', HOST, COLOR.cyan);
        status('PORT', PORT, COLOR.cyan);
        console.log('\n==================================================\n');

        // 2. Verify Database connection after server starts
        try {
            await db.verify();
            status('MYSQL', '● CONNECTED', COLOR.green);
        } catch (error) {
            status('MYSQL', '● FAILED', COLOR.red);
            console.error(`${COLOR.red}${error.message}${COLOR.reset}`);
            console.error(`${COLOR.red}Server startup stopped: database connection is required.${COLOR.reset}\n`);
            process.exit(1);
        }

        // 3. Verify Email connection asynchronously (prevents deployment hangs)
        try {
            await mail.verify();
            status('MAIL', '● CONNECTED', COLOR.green);
        } catch (error) {
            status('MAIL', '● FAILED', COLOR.red);
            console.error(`${COLOR.red}${error.message}${COLOR.reset}`);
            console.warn(`${COLOR.yellow}Email/OTP sending may not work until SMTP is fixed.${COLOR.reset}`);
        }
    });

    // Server error handler
    server.on('error', (error) => {
        status('SERVER', '● FAILED', COLOR.red);
        console.error(`${COLOR.red}${error.message}${COLOR.reset}`);
        process.exit(1);
    });
}

startServer();
