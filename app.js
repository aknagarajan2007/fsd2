const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Allow your GitHub Pages site to display this in an iframe
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://github.io"
  );
  next();
});

app.get('/', (req, res) => {
  res.render('app', { text: 'Hello from Express and EJS!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
