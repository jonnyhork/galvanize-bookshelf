'use strict'


const express = require('express')
const boom = require('boom')
const knex = require('../knex')
const {
  camelizeKeys,
  decamelizeKeys
} = require('humps')

// eslint-disable-next-line new-cap
const router = express.Router()

router.get('/', (_req, res, next) => {
  knex('books')
    .orderBy('title')
    .then((rows) => {
      let books = camelizeKeys(rows)
      res.send(books)
    }).catch((err) => next(err))
})

router.get('/:id', (req, res, next) => {
  let id = Number(req.params.id)
  if (Number.isNaN(id)) {
    return next(boom.create(400))
  }
  knex('books')
    .where('id', id)
    .first()
    .then((row) => {
      if (!row) {
        return next(boom.create(404), 'Not Found')
      }
      let book = camelizeKeys(row)
      res.send(book)
    }).catch((err) => next(err))
})

router.post('/', (req, res, next) => {
  let {
    title,
    author,
    genre,
    description,
    coverUrl
  } = req.body

  if (!title || !title.trim()) {
    return next(boom.create(400, 'Title must not be blank'))
  }
  if (!author || !author.trim()) {
    return next(boom.create(400, 'Author must not be blank'))
  }
  if (!gerne || !gerne.trim()) {
    return next(boom.create(400, 'Genre must not be blank'))
  }
  if (!description || !description.trim()) {
    return next(boom.create(400, 'Description must not be blank'))
  }
  if (!coverUrl || !coverUrl.trim()) {
    return next(boom.create(400, 'Cover URL must not be blank'))
  }
  let insertBook = {
    title,
    author,
    genre,
    description,
    coverUrl
  }
  knex('books')
    .insert(decamelizeKeys(insertBook), '*')
    .then((book) => {
      res.send(camelizeKeys(book[0]))
    }).catch((err) => next(err))
})

router.patch('/:id', (req, res, next) => {
  let id = Number(req.params.id)
  if (Number.isNaN(id)) {
    return next(boom.create(400, 'Id must be a number'))
  }
  knex('books')
    .where('id', id)
    .first()
    .then((book) => {
      if (!book) {
        return next(boom.create(404), 'Not Found')
      }
      let {
        title,
        author,
        genre,
        description,
        coverUrl
      } = req.body
      let updateBook = {}
      if (title) {
        updateBook.title = title
      }
      if (author) {
        updateBook.author = author
      }
      if (genre) {
        updateBook.genre = genre
      }
      if (description) {
        updateBook.description = description
      }
      if (coverUrl) {
        updateBook.coverUrl = coverUrl
      }
      return knex('books')
        .update(decamelizeKeys(updateBook), '*')
        .where('id', id)
        .first()
    }).then((row) => {
      let book = camelizeKeys(row)
      res.send(book)
    }).catch((err) => next(err))


})

router.delete('/:id', (req, res, next) => {
  let id = Number(req.params.id)
  if (Number.isNaN(id)) {
    return next(boom.create(400))
  }

  let book
  knex('books')
    .where('id', id)
    .then((row) => {
      if (!row) {
        return next(boom.create(404, 'Not Found'))
      }
      book = camelizeKeys(row[0])
      return knex('books')
        .del()
        .were('id', id)
        .then(() => {
          delete book.id
          res.send(book)
        })
    }).catch((err) => next(err))

})


module.exports = router
