const express = require('express');
const ejs = require('ejs');
const path = require('path');

const app = express();

// Set Template Engine
app.set('view engine', 'ejs');

// Set middleware
const myLogger = (req, res, next) => {
  console.log('Middleware: myLogger');
  next();
};
// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  //res.sendFile(path.resolve(__dirname, 'temp/index.html'));
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/photos', (req, res) => {
  console.log(req.body);
  res.redirect('/');
});

const port = 3010;
app.listen(port, () => console.log(`Listening on port ${port}...`));
