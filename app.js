const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Mount the consolidated auth router
app.use('/',require('./server/index.js'));
app.use('/auth', require('./server/auth.js'));

// Main index route (ensure ./server/index.js exists)
// app.use('/', require('./server/index.js'));

app.use((req, res) => {
    res.status(404).send('404 - AK Fabrics Page Not Found');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
    console.log(`AK Fabrics server running on port ${port}`);
});