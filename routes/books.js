'use strict';

const express = require('express');
const knex = require('../knex')

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE

// C
router.post('/:id', (req, res, next) => {

})
// R
/* get all the books */
router.get('/', (_req, res, next) => {
  knex('books')
    .select('id', 'title', 'author', 'genre', 'description', 'cover_url', 'created_at', 'updated_at')
    .orderBy('title', 'ASC')
    .then((books) => {
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify(books))
    })
    .catch((err) => next(err))
})
/* Get one specific book */
router.get('/:id', (req, res, next) => {

})
// U
router.patch('/:id', (req, res, next) => {

})
// D
router.delete('/:id', (req, res, next) => {

})
module.exports = router;
