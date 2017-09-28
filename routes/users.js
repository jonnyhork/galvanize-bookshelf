'use strict';

const express = require('express');
const bcrypt = require('bcrypt')
const humps = require('humps')
const knex = require('../knex')

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE

router.post('/', (req, res, next) => {

  let {
    firstName,
    lastName,
    email,
    password
  } = req.body

  // console.log('req.body: ', req.body);
  bcrypt.hash(password, 10).then((hash) => {

    return knex('users')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        hashed_password: hash
      }, '*')
      .then((user) => {
        // console.log('user is:', user);
        let newUser = {
          id: user[0].id,
          first_name: firstName,
          last_name: lastName,
          email: email
        }
        // console.log('newUser with camel is:', humps.camelizeKeys(newUser));
        res.setHeader('Content-Type', 'application/json')
        res.send(humps.camelizeKeys(newUser))
      })
      .catch((err) => next(err))

  })
})

module.exports = router;
