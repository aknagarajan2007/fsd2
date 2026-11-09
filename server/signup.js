
const express = require('express');
const router = express.Router();

// GET /auth/signup
router.get('/', (req, res) => {
    res.render('signup');
});

// POST /auth/signup
router.post('/', async (req, res) => {
    const { email, name, password } = req.body;

    try {
        await execute(
            'INSERT INTO users (email, name, password) VALUES (?, ?, ?)',
            [email, name, password]
        );

        res.redirect('/auth/login');

    } catch (err) {
        console.error(err);
        res.status(500).send('Signup failed');
    }
});

module.exports = router;
