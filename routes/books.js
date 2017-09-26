'use strict';

const express = require('express');
const knex = require('../knex')

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE

// C
router.post('/', (req, res, next) => {
  // console.log("req body:", req.body)

  knex('books')
    .insert({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      cover_url: req.body.coverUrl,
    }, '*')
    .then((book) => {

      let newBook = {
        id: book[0].id,
        title: book[0].title,
        author: book[0].author,
        genre: book[0].genre,
        description: book[0].description,
        coverUrl: book[0].cover_url,
      }

      // res.setHeader('Content-Type', 'application/json')
      res.send(newBook)
    }).catch((err) => next(err))

})
// R
/* get all the books */
router.get('/', (_req, res, next) => {

  knex('books')
    .select('id', 'title', 'author', 'genre', 'description', 'cover_url as coverUrl', 'created_at as createdAt', 'updated_at as updatedAt')
    .orderBy('title', 'ASC')
    .then((books) => {
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify(books))

    })
    .catch((err) => next(err))
})
/* Get one specific book */
router.get('/:id', (req, res, next) => {

  let id = Number(req.params.id)

  // if (typeof id !== 'number') {
  //   return res.sendStatus(404)
  // }

  knex('books')
    .select('id', 'title', 'author', 'genre', 'description', 'cover_url as coverUrl', 'created_at as createdAt', 'updated_at as updatedAt')
    .where('id', id)
    // .orderBy('id')
    .then((book) => {

      // if (!book) {
      //   return res.sendStatus(404)
      // }
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify(book[0]))

    })

    .catch((err) => next(err))
})
// U
router.patch('/:id', (req, res, next) => {

})
// D
router.delete('/:id', (req, res, next) => {

})
module.exports = router;
