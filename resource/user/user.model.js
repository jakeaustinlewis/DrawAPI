const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    lowercase: true,
    required: true,
    trim: true,
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userModel);
