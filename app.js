const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');

const ejs = require('ejs');
const path = require('path');

const photoController = require('./controllers/photoControllers');
const pageController = require('./controllers/pageControllers');

//Mongoose models
const Photo = require('./models/Photo');

const app = express();

//Connect to DB
mongoose
  .connect('mongodb://127.0.0.1:27017/photo-blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    /*  useFindAndModify: false, */
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.log('Error connecting to MongoDB', err);
  });

// Set Template Engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  }),
);

// Routes
app.get('/', photoController.getAllPhotos);
app.post('/photos', photoController.createPhoto);
app.get('/photos/:id', photoController.getPhoto);
app.put('/photos/:id', photoController.updatePhoto);
app.delete('/photos/:id', photoController.deletePhoto);

app.get('/about', pageController.getAboutPage);

app.get('/add', pageController.getAddPage);

app.get('/photos/edit/:id', pageController.getEditPage);

const port = 3010;
app.listen(port, () => console.log(`Listening on port ${port}...`));
