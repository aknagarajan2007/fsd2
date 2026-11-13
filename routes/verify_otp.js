const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const db = require('../config/db.js');

function hashOTP(otp) {
    if (!process.env.OTP_SECRET) throw new Error('OTP_SECRET missing in .env');
    return crypto.createHmac('sha256', process.env.OTP_SECRET)
        .update(otp)
        .digest();
}

router.get('/verify_otp', (req, res) => {
    if (!req.session.user || req.session.user.status !== 'pending') {
        return res.redirect('/register');
    }
    res.render('verify_otp', { err: null });
});

// FIXED: Removed the extra '/auth' prefix so it matches the GET route
router.post('/verify_otp', async (req, res) => {
    const { otp } = req.body;
    const user = req.session.user;

    if (!user || user.status !== 'pending') {
        return res.redirect('/register');
    }

    const { otpHash, otpExpiresAt, otpAttempts = 0 } = user;

    if (otpAttempts >= 5) {
        req.session.destroy();
        return res.render('verify_otp', { err: 'Too many attempts. Please register again.' });
    }

    if (Date.now() > otpExpiresAt) {
        req.session.destroy();
        return res.render('verify_otp', { err: 'OTP expired. Please register again.' });
    }

    try {
        if (!/^\d{6}$/.test(otp || '')) {
            user.otpAttempts++;
            return res.render('verify_otp', { err: 'Invalid OTP format.' });
        }

        const submittedHash = hashOTP(otp);
        const storedHash = Buffer.from(otpHash, 'hex');

        const valid = storedHash.length === submittedHash.length &&
            crypto.timingSafeEqual(storedHash, submittedHash);

        if (!valid) {
            user.otpAttempts++;
            return res.render('verify_otp', {
                err: `Invalid OTP. ${5 - user.otpAttempts} attempts remaining.`
            });
        }

        await db.execute('UPDATE users SET verified = 1 WHERE id = ?', [user.id]);

        // Regenerate session for authenticated state
        req.session.regenerate((err) => {
            if (err) throw err;
            req.session.user = {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                status: 'verified'
            };
            return res.redirect('/shop');
        });

    } catch (err) {
        console.error('OTP Verification Error:', err);
        return res.render('verify_otp', { err: 'Verification failed. Please try again.' });
    }
});

module.exports = router;