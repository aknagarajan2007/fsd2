const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const router = express.Router();
const db = require('../config/db.js');
const mail = require('../config/mail.js');

const generateOTP = () => crypto.randomInt(100000, 1000000).toString();

const hashOTP = (otp) => {
    if (!process.env.OTP_SECRET) throw new Error('OTP_SECRET missing in .env');
    return crypto.createHmac('sha256', process.env.OTP_SECRET)
        .update(otp)
        .digest('hex'); // Storing as hex string in session
};

async function sendOTP(req, user) {
    const otp = generateOTP();

    req.session.user = {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        purpose: 'registration',
        status: 'pending',
        otpHash: hashOTP(otp),
        otpExpiresAt: Date.now() + 5 * 60 * 1000,
        otpAttempts: 0
    };

    await mail(
        user.email,
        otp,
        'Use the OTP below to verify your email address.',
        'Welcome to AK Fabrics!',
        'Email Verification',
        'Never share your OTP with anyone.'
    );
}

router.get('/register', (req, res) => {
    res.render('register', { err: null });
});

router.post('/register', async (req, res) => {
    const { email, password, confirm_password, fullname } = req.body;

    if (!email || !password || !fullname || password.length < 8) {
        return res.render('register', { err: 'All fields required and password must be 8+ chars!' });
    }

    if (password !== confirm_password) {
        return res.render('register', { err: 'Passwords do not match!' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        const [result] = await db.execute(
            `INSERT INTO users (email, fullname, password, verified)
             VALUES (?, ?, ?, 0)`,
            [email.toLowerCase().trim(), fullname.trim(), hashedPassword]
        );

        await sendOTP(req, { id: result.insertId, fullname, email });
        return res.redirect('/auth/verify_otp');

    } catch (err) {
        console.error('Registration Error:', err);

        if (err.code === 'ER_DUP_ENTRY') {
            try {
                const [rows] = await db.execute(
                    'SELECT id, fullname, verified FROM users WHERE email = ?',
                    [email.toLowerCase().trim()]
                );

                const user = rows[0];

                if (!user || user.verified) {
                    return res.render('register', { err: 'Email already registered!' });
                }

                const hashedPassword = await bcrypt.hash(password, 12);
                await db.execute(
                    `UPDATE users SET fullname = ?, password = ? WHERE id = ? AND verified = 0`,
                    [fullname.trim(), hashedPassword, user.id]
                );

                await sendOTP(req, { id: user.id, fullname, email });
                return res.redirect('/auth/verify_otp');

            } catch (retryErr) {
                console.error('Registration Retry Error:', retryErr);
            }
        }

        return res.render('register', { err: 'Registration failed. Please try again.' });
    }
});

module.exports = router;