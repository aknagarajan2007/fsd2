const express = require('express');
const router = express.Router();

// --- GET Routes (Render Views) ---
router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));
router.get('/forget-password', (req, res) => res.render('forget-password'));
router.get('/verify-otp', (req, res) => res.render('verify-otp'));
router.get('/change-password', (req, res) => res.render('change-password'));

// --- POST Routes (Process Forms) ---
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`"${email}" is trying to login (PASSWORD:"${password}")`);
    res.redirect('/');
}); 

router.post('/register', (req, res) => {
    const { fullname, email, password, 'confirm-password': confirmPassword } = req.body;
    console.log(`"${fullname}" (${email}) is registering (PWD:"${password}" CONFIRM:${confirmPassword})`);
    res.redirect('/');
});

router.post('/forget-password', (req, res) => {
    const { email } = req.body;
    console.log(`"${email}" is trying to reset password`);
    res.redirect('/auth/verify-otp');
}); 

router.post('/verify-otp', (req, res) => {
    const { otp } = req.body;
    console.log(`"${otp}" is the OTP entered`);
    res.redirect('/auth/change-password');
}); 

router.post('/change-password', (req, res) => {
    const { newpassword, 'confirm-password': confirmPassword } = req.body;
    console.log(`New password: ${newpassword} | Confirm: ${confirmPassword}`);
    res.redirect('/auth/login');
});

module.exports = router;