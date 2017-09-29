'use strict';

const express = require('express')
const jwt = require('jsonwebtoken')
const knex = require('../knex')
const bcrypt = require('bcrypt')
const humps = require('humps')
const boom = require('boom')
const SECRET = process.env.JWT_KEY

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', (req, res, next) => {

  // verify the token
  // console.log("got cookies", req.cookies)

  jwt.verify(req.cookies.token, SECRET, (err, payload) => {
    // if there is no token then send res.send(false)
    if (err) {
      // console.log('There was no token')
      return res.send(false)
    }
    // request assumes a token was created by the previous POST /token request
    // if there is a token then send res.send(true)
    res.send(true)

  })
})



router.post('/', (req, res, next) => {

  // first you have to verify the request body was good

  let {
    email,
    password
  } = req.body

  if (!email) {
    next(boom.create(400, 'Email must not be blank'))
    return
  }

  if (!password) {
    next(boom.create(400, 'Password must not be blank'))
  }

  // if the req.body was valid then use the email to find the user in the DB



  knex('users')
    .where('email', email)
    .first()
    .then((user) => {
      // console.log('\n\nTHE USER IS: ', user)
      // console.log('\n\nTHE USER HASH IS\n\n', user.hashed_password);
      if (!user) {
        next(boom.create(400, 'Bad email or password'))
      }

      // check to make sure the password is valid
      if (bcrypt.compareSync(req.body.password, user.hashed_password)) {

        // console.log('BCRYPT COMPARESYNC: ', bcrypt.compareSync(req.body.password, user.hashed_password));
        // console.log('BCRYPT COMPARE: ', bcrypt.compare(req.body.password, user.hashed_password));
        // console.log('USER ID IS: ', user.id);
        // console.log('currentUser is:', currentUser);
        // return res.send('the password matched')

        //token will be made, let token = jwt.sign(user.id, SECRET)
        let token = jwt.sign({
          userId: user.id
        }, SECRET)

        // looking to store a cookie with a token res.cookie("token", token)


        res.cookie("token", token, {
          httpOnly: true
        })

      } else {
        return next(boom.create(400, 'Bad email or password'))
      }
      delete user.hashed_password
      res.send(humps.camelizeKeys(user))
    }).catch((err) => next(err))



})

router.delete('/', (req, res, next) => {
  // delete the cookie 'token'

  res.clearCookie("token")
  res.send(true)
})


module.exports = router;
