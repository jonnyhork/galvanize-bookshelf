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

/* If I declare currentUser outside a route scope all routes can use it. If I set req.currentUser inside the is Auth function then I can use req.[variable name] in any route, why is that?*/
// let currentUser


const isAuth = (req, res, next) => {
  jwt.verify(req.cookies.token, SECRET, (err, payload) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'))
    }
    // console.log('PAYLOAD: ', payload)
    // console.log('PAYOAD ID', payload.userId);
    // currentUser = payload
    req.currentUser = payload
    // console.log('req.currentUser: ', req.currentUser);
    // console.log('currentUser at isAuth: ', currentUser)
    // console.log('req.claim==', req.claim);
    next()
  })

}

// TOKEN IS CREATED WITH A USER OF user_id = 1 (userId = 1?)

router.get('/', isAuth, (req, res, next) => {
  // console.log(' AT GET req.currentUser: ', req.currentUser);
  // console.log('currentUser at GET: ', currentUser)


  knex('favorites')
    .where('user_id', req.currentUser.userId)
    .innerJoin('books', 'favorites.user_id', 'books.id')
    .then((result) => {
      // console.log('RESULT OF PAYLOAD WITH USER-ID:', result);
      res.send(camelizeKeys(result))
    })
})


router.get('/check?bookId=:id', isAuth, (_req, res, next) => {

})

router.post('/', isAuth, (req, res, next) => {

  // need to insert bookid and a user id to the favoirtes table
  // user id will come from the req.cookies.token.
  // book id will come from the req.body.bookId

  let {
    bookId
  } = req.body

  // console.log("CURRENT USER IS: ", currentUser);

  knex('favorites')
    .insert({
      book_id: bookId,
      user_id: req.currentUser.userId
    }, '*').then((newFavorite) => {

      // console.log('newFavorite== ', newFavorite);

      let newObj = {
        id: newFavorite[0].id,
        userId: req.currentUser.userId,
        bookId: newFavorite[0].book_id
      }

      res.send(newObj)

    }).catch((err) => next(err))

  // camelizeKeys(newFavorite)


})


router.delete('/', isAuth, (req, res, next) => {

  let favorite

  knex('favorites')
    .where('book_id', req.body.bookId)
    .then((row) => {
      if (!row) {
        return next(boom.create(404, 'favorite not found'))
      }

    })
})



module.exports = router;
