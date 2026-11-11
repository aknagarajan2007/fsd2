const express = require('express');
const router = express.Router();

router.get('/register', (req, res) => res.render('register'));

router.post('/register', (req, res) => {
    const { fullname, email, password, 'confirm-password': confirmPassword } = req.body;
    
    console.log(`"${fullname}" with email ${email} is trying to register hidden(PASSWORD:"${password}" CONFIRMPASSWORD:${confirmPassword})`);
    
    res.redirect('/');
});

module.exports = router;