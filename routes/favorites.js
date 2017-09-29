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

let currentUser

// TOKEN IS CREATED WITH A USER OF user_id = 1 (userId = 1?)

router.get('/', (req, res, next) => {

  if (req.cookies.token) {
    jwt.verify(req.cookies.token, SECRET, (err, payload) => {
      if (err) {
        return next(boom.create(401, 'Unauthorized'))
      }
      console.log('PAYLOAD: ', payload)
      console.log('PAYOAD ID', payload.userId);

      currentUser = payload

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

  // need to insert bookid and a user id to the favoirtes table
  // user id will come from the req.cookies.token.
  // book id will come from the req.body.bookId

  let {
    bookId
  } = req.body

  console.log("CURRENT USER IS: ", currentUser);

  knex('favorites')
    .insert({
      book_id: bookId,
      user_id: currentUser.userId
    }, '*').then((newFavorite) => {

      console.log('newFavorite== ', newFavorite);

      let newObj = {
        id: newFavorite[0].id,
        userId: currentUser.userId,
        bookId: newFavorite[0].book_id
      }

      res.send(newObj)

    }).catch((err) => next(err))

  // camelizeKeys(newFavorite)


})






module.exports = router;
