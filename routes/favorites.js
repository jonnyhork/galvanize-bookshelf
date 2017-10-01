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

/* If I declare currentUser outside a route scope all routes can use it. If I set req.currentUser inside the is Auth function then I can use req.[variable name] in any route, why is that?
  -  because req is passed as a parameter */
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


router.get('/check', isAuth, (req, res, next) => {
  // console.log('REQ.QUERY IN /CHECK IS : ', req.query)

  let bookId = Number(req.query.bookId)

  if (Number.isNaN(bookId)) {
    return next(boom.create(400, 'Book ID must be an integer'))
  }

  knex('favorites')
    .where({
      book_id: bookId,
      user_id: req.currentUser.userId
    })
    .first()
    .then((row) => {
      // console.log('/CHECK ROW book_id IS: ', row.book_id)
      if (!row) {
        return res.send(false) // IF NOT RETURN, THEN YOU GET ERR SET HEADERS AFTER THEY ARE SENT.
      }


      res.send(true)


    })

})

router.post('/', isAuth, (req, res, next) => {

  // NEED TO INSERT BOOKID AND A USER ID TO THE FAVOIRTES TABLE
  // USER ID WILL COME FROM THE REQ.COOKIES.TOKEN.
  // BOOK ID WILL COME FROM THE REQ.BODY.BOOKID

  let {
    bookId
  } = req.body


  if (Number.isNaN(Number(bookId))) {
    return next(boom.create(400, 'Book ID must be an integer'))
  }

  knex('favorites')
    .where('book_id', bookId)
    .first()
    .then((row) => {
      if (!row) {
        // return res.status(404).send('Book not found')
        throw boom.create(404, 'Book not found')
      }

      return knex('favorites')
        .insert({
          book_id: bookId,
          user_id: req.currentUser.userId
        }, '*')
    })
    .then((newFavorite) => {

      // NEED ERROR HANDLER FOR BOOK ID NOT FOUND.

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
  // TURN THE REQ.BODY .BOOK ID INTO A NUMBER
  let bookId = Number(req.body.bookId)
  // IF IT'S NOT A KNUMBER THEN SEND AN ERROR
  if (Number.isNaN(bookId)) {
    return next(boom.create(400, 'Book ID must be an integer'))
  }

  let favorite
  // CREATE A BUCKET FOR THE ID'D BOOK INFO TO BE STORED BEFORE DELETION
  knex('favorites')
    .where({
      book_id: bookId,
      user_id: req.currentUser.userId
    })
    .first()
    .then((row) => {
      // console.log('deletion row: ', row);
      if (!row) {
        return next(boom.create(404, 'Favorite not found'))
      }
      //ONCE YOUVE FOUND THE SELECTED BOOK, ADD TO BUCKET.
      favorite = camelizeKeys(row)
      // console.log('deletion favorite is: ', favorite);

      // SELECT THE BOOK AGAIN AND DELETE IT, NEED TO RETURN BECAUSE THE CONNECTION WILL STAY OPEN.
      return knex('favorites')
        .del()
        .where('id', favorite.id)

    }).then(() => {
      delete favorite.id
      res.send(favorite)
    }).catch((err) => next(err))

})



module.exports = router;
