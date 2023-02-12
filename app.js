const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');

const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

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
app.get('/', async (req, res) => {
  const photos = await Photo.find({});
  //res.sendFile(path.resolve(__dirname, 'temp/index.html'));
  res.render('index', {
    photos,
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('edit', {
    photo,
  });
});

app.post('/photos', async (req, res) => {
  //Eğer klasör yoksa oluşturacak
  const uploadDir = 'public/uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  // Yükeldiğimiz dosyayı yakalayıp isteiğimiz bilgileri değişkenleri aktarıyoruz
  let uploadeImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadeImage.name;

  // Yakaladığımız dosyayı .mv metodu ile yukarda belirlediğimiz path'a taşıyoruz. Dosya taşıma işlemi sırasında hata olmadı ise req.body ve içerisindeki image'nin dosya yolu ve adıyla beraber database kaydediyoruz
  uploadeImage.mv(uploadPath, async err => {
    if (err) console.log(err); // Bu kısımda önemli olan add.ejs'nin içerisine form elemanı olarak encType="multipart/form-data" atribute eklemek
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadeImage.name,
    });
  });
  res.redirect('/');
});

app.get('/photos/:id', async (req, res) => {
  //const photo = photos.find(photo => photo.id === parseInt(req.params.id));
  const photo = await Photo.findById({ _id: req.params.id });
  res.render('photo', {
    photo,
  });
});

app.put('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  photo.title = req.body.title;
  photo.description = req.body.description;
  await photo.save();
  res.redirect(`/photos/${req.params.id}`);
});

app.delete('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deleteImage = __dirname + '/public' + photo.image;
  fs.unlinkSync(deleteImage);
  await Photo.findByIdAndDelete({ _id: req.params.id });
  res.redirect('/');
});

const port = 3010;
app.listen(port, () => console.log(`Listening on port ${port}...`));
