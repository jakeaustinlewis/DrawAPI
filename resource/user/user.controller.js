
const express = require('express');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const permit = require('../../middleware/permit');
const User = require('./user.model.js');

const router = new express.Router();
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

/**
 * Validate existing JWT or email/pass and issue a new JWT.
 * @param {String} req.body.email - User email.
 * @param {String} req.body.password - User password.
 */
router.post('/auth', async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(500).send();
  }

  const criteria = { email: req.body.email.toLowerCase() };

  let user = await User.findOne(criteria);
  if (!user || user.length > 1) {
    return res.status(500).send();
  }

  user = user.toObject();

  // Password check if passwords are hashed
  bcrypt.compare(req.body.password, user.password, (err, valid) => {
    if (err || !valid) {
      return res.status(401).send();
    }
    res.send({ user });
  });
});
module.exports = router;
