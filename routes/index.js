const express = require('express');
const router = express.Router();

// GET: Home page
router.get('/', async (req, res) => {
    try {
        res.render('index', {
            title: 'Home'
        });

    } catch (error) {
        console.error('Index route error:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;