'use strict';

const express = require('express')
const jwt = require('jsonwebtoken')
const knex = require('../knex')
const bcrypt = require('bcrypt')
const {
  camelizeKeys
} = require('humps')
const boom = require('boom')
const SECRET = process.env.JWT_KEY
// eslint-disable-next-line new-cap
const router = express.Router()

// TOKEN IS CREATED WITH A USER OF user_id = 1 (userId = 1?)

router.get('/', (req, res, next) => {

  if (req.cookies.token) {
    jwt.verify(req.cookies.token, SECRET, (err, payload) => {
      if (err) {
        return next(boom.create(401, 'Unauthorized'))
      }
      console.log('PAYLOAD: ', payload)
      console.log('PAYOAD ID', payload.userId);

      knex('favorites')
        .where('user_id', payload.userId)
        .innerJoin('books', 'favorites.user_id', 'books.id')
        .then((result) => {
          console.log('RESULT OF PAYLOAD ID:', result);
          res.send(camelizeKeys(result))
        })
    })
  }


})

router.get('/check?bookId=:id', (_req, res, next) => {

})

router.post('/', (req, res, next) => {
  // let {}
  knex('favorites')
    .insert() // req.body info

  // res.send() the updated stuff


})






module.exports = router;
