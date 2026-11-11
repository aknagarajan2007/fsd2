const express = require('express');
const router = express.Router();

router.get('/verify-otp', (req, res) => res.render('verify-otp'));
router.post('/verify-otp', (req, res) => {
    const { otp } =req.body;
    console.log(`"${otp}" is the otp enterd`)
    res.redirect('/');
}); 
module.exports = router;