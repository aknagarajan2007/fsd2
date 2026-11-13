const path = require('path');
const express = require('express');
const session = require('express-session');
const { COLOR } = require('./utils/logger');

const app = express();

// -------------------- Express configuration --------------------

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, './views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));
if (process.env.TRUST_PROXY === 'true') {
    app.set('trust proxy', 1);
}
// -------------------- Session configuration --------------------

if (!process.env.SESSION_SECRET) {
    console.warn(
        `${COLOR.yellow}[WARNING]${COLOR.reset} SESSION_SECRET is missing. ` +
        'Set it in .env before production deployment.'
    );
}

app.use(session({
    name: 'akf.sid',
    secret: process.env.SESSION_SECRET || 'development-only-secret-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// -------------------- Routes --------------------

app.use('/', require('./routes/index.js'));
app.use('/auth',require('./routes/login.js'));
app.use('/auth',require('./routes/register.js'));
app.use('/auth',require('./routes/verify_otp.js'));















// -------------------- 404 & Error handlers --------------------

app.use((req, res) => {
    res.status(404).send('Page not found');
});

app.use((error, req, res, next) => {
    console.error(`${COLOR.red}[APP ERROR]${COLOR.reset}`, error.stack || error.message);
    if (res.headersSent) {
        return next(error);
    }
    res.status(500).send('Internal server error');
});

module.exports = app;