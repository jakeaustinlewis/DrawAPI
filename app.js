const express = require('express');
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

mongoose.connect(`${process.env.DB_HOST}/StrokeWithFriends`, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.log('Could not connect to MongoDB'))


app.set('view engine', 'pug');
app.set('views', './views'); // default

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public'));
// app.use(helmet());
// app.use(logger);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

// Controllers
const user = require('./resource/user/user.controller.js');

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
