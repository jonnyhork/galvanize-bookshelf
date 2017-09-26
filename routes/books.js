'use strict';

const express = require('express');
const knex = require('../knex')

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE

// C
router.post('/', (req, res, next) => {



})
// R
/* get all the books */
router.get('/', (_req, res, next) => {

  knex('books')
    .select('id', 'title', 'author', 'genre', 'description', 'cover_url', 'created_at', 'updated_at')
    .orderBy('title', 'ASC')
    .then((books) => {
      res.setHeader('Content-Type', 'application/json')
      res.json(books)

    })
    .catch((err) => next(err))
})
/* Get one specific book */
router.get('/:id', (req, res, next) => {

  let id = req.params.id

  if (typeof id !== 'number') {
    res.sendStatus(404)
  }

  knex('books')
    .select('id', 'title', 'author', 'genre', 'description', 'cover_url', 'created_at', 'updated_at')
    .where('id', id)
    .then((book) => {

      if (!book) {
        return res.sendStatus(404)
      }

      res.json(book)

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
