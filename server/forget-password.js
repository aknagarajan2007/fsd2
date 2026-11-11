const express = require('express');
const router = express.Router();

router.get('/forget-password', (req, res) => res.render('forget-password'));
router.post('/forget-password', (req, res) => {
    const { email } =req.body;
    console.log(`"${email}" is trying to reset password")`)
    res.redirect('/');
}); 
module.exports = router;