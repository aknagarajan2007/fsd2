const nodemailer = require('nodemailer');
const { COLOR, status } = require('../utils/logger');

// Gmail transporter with a 10-second timeout so it doesn't hang deployments
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    // Force IPv4 to prevent Node 24+ IPv6 resolution timeouts on Render
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 10000, 
    greetingTimeout: 10000,
    socketTimeout: 10000
});
// Verify email connection
sendMail.verify = async () => transporter.verify();

// Send email
async function sendMail(email, otp, message, heading, subject, footer) {
    try {
        const info = await transporter.sendMail({
            from: `"AK Fabrics" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subject || heading,
            html: `
                <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;color:#222;background:#fff;border:1px solid #eee;border-radius:12px;">
                    <h2 style="color:#173b2b;">${heading}</h2>
                    <p>${message}</p>
                    ${otp ? `
                        <h1 style="color:#b42332;letter-spacing:8px;text-align:center;padding:12px;">
                            ${otp}
                        </h1>
                        <p>This OTP expires in 5 minutes.</p>
                    ` : ''}
                    <p style="color:#777;font-size:13px;">${footer}</p>
                </div>
            `
        });

        status('MAIL', `SENT to ${email}`, COLOR.green);
        return info;

    } catch (error) {
        status('MAIL ERROR', error.message, COLOR.red);
        throw error;
    }
}

module.exports = sendMail;
