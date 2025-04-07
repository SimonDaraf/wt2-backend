/**
 * @file Router for the application.
 * @module src/routes/router
 * @author Simon Danielsson
 * @version 1.0.0
 */

import express from 'express'
import http from 'node:http'
export const router = express.Router()

router.get('/', (req, res, next) => {
  res.status(200).send("Working :)")
})

// Catch 404
router.use('*', (req, res, next) => {
  const statusCode = 404
  const error = new Error(http.STATUS_CODES[statusCode])
  error.status = statusCode
  next(error)
})
