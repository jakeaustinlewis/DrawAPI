const helmet = require('helmet');
const express = require('express');
require('dotenv').config();

const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('./middleware/logger');

mongoose.connect(`${process.env.DB_HOST}/StrokeWithFriends`, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.log('Could not connect to MongoDB'));

// Controllers
const user = require('./resource/user/user.controller.js');

// If process.env.NODE_ENV is not set, app.get('env') defaults to development
if (app.get('env') === 'development') {
  app.use(morgan('tiny')); // every time we send a request to the server, it will be logged
  console.log('Morgan enabled...');
}

app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
app.use(helmet()); // Helmet helps you secure your Express apps by setting various HTTP headers

// middleware
app.use(logger);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.use('/user', user);

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
