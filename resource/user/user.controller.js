const express = require('express');
const router = new express.Router();
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const permit = require('../../middleware/permit');
const User = require('./user.model.js');



/**
 * Create a new user.
 * @param {String} req.body.firstName - User first name.
 * @param {String} req.body.lastName - User last name.
 * @param {String} req.body.email - Unique user email.
 * @param {String} req.body.password - User password.
 */
router.post('/', async (req, res) => {
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) return res.status(500).send('Missing required fields.');
  
    const existing = await User.findOne({ email: req.body.email });
    if (existing) return res.sendStatus(500);
  
    const hash = await bcrypt.hash(req.body.password, 10);
    if (!hash) return res.status(500).send();
  
    let created;
    try {
      created = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
      });
    } catch (e) {
      return res.status(500).send('Server error creating new user');
    }
    res.send(created);
  });