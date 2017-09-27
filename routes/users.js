'use strict';

const express = require('express');
const bcrypt = require('bcrypt')
const humps = require('humps')
const knex = require('knex')

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE

router.post('/', (req, res, next) => {

  let {
    first_name,
    last_name,
    email,
    password
  } = req.body

  bcrypt.hash(password, 10).then((hash) => {

    knex('users')
      .insert({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: hash
      }, '*')
      .then((user) => {

        let newUser = {
          first_name: first_name,
          last_name: last_name,
          email: email
        }

        res.setHeader('Content-Type', 'application/json')
        res.send(humps.camelize(newUser))
      })
      .catch((err) => next(err))

  })
})

module.exports = router;
