const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => res.render('login'));
router.post('/login', (req, res) => {
    const { email , password } =req.body;
    console.log(`"${email}" is trying to login hidden(PASSWORD:"${password}")`)
    res.redirect('/');
}); 

module.exports = router;