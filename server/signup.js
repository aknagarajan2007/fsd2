
const express = require('express');
const router = express.Router();

// Display signup page
router.get('/auth/signup', (req, res) => {
    res.render('signup');
});

// Process signup
router.post('/auth/signup', async (req, res) => {
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
