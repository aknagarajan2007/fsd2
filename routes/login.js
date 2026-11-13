const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../config/db.js');

// GET: Login page
router.get('/login', (req, res) => {
    res.render('login', { err: null });
});

// POST: Authenticate user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('login', { err: 'Email and password are required' });
    }

    try {
        // Fetch user by email only
        const [rows] = await db.execute(
            'SELECT id, fullname, password, verified FROM users WHERE email = ?',
            [email]
        );

        if (!rows.length) {
            return res.render('login', { err: 'Invalid email or password' });
        }

        const user = rows[0];

        // Securely compare the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { err: 'Invalid email or password' });
        }

        if (!user.verified) {
            return res.render('login', { err: 'Please verify your email first' });
        }

        // Prevent session fixation by regenerating the session identifier
        req.session.regenerate((err) => {
            if (err) throw err;
            req.session.user = {
                id: user.id,
                fullname: user.fullname,
                email
            };
            return res.redirect('/shop');
        });

    } catch (err) {
        console.error('Login Error:', err);
        return res.render('login', {
            err: 'Something went wrong. Please try again.'
        });
    }
});

module.exports = router;