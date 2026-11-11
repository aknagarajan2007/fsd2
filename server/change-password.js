
const express = require('express');
const router = express.Router();

router.get('/change-password', (req, res) => {
    res.render('change-password');
});

router.post('/change-password', (req, res) => {
    const { newpassword, 'confirm-password': confirmPassword } = req.body;

    console.log(`New password: ${newpassword} and Confirm password: ${confirmPassword}`);

    res.redirect('/');
});

module.exports = router;
