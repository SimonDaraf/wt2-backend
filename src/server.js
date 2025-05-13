/**
 * @file The starting point of the application.
 * @module src/server
 * @author Simon Danielsson
 * @version 1.0.0
 */

import express from 'express'
import logger from 'morgan'
import { router } from './routes/router.js'
import { dbPool } from './config/dbConfig.js'

try {
  // Create the express application.
  const app = express()

  // Set up morgan
  app.use(logger('dev'))

  app.use(express.json({ extended: false }))
  app.use(express.urlencoded({ extended: true }))

  // Test the connection.
  const [rows] = await dbPool.query('SELECT 1')
  console.log(`Database connection seccessful: ${rows}`)

  // Middleware to be executed before the routes.
  app.use((req, res, next) => {
    // Attach the db pool instance to the request object.
    req.db = dbPool
    next()
  })

  // Register routes.
  app.use('/', router)

  // Handle errors.
  app.use((error, req, res, next) => {
    console.error(error)
    // Handle 404
    if (error.status === 404) {
      // Display a custom 404 page.
      res
        .status(404)
        .send('Resource not found.')
      return
    }

    // Handle 400
    if (error.status === 400) {
      // Display a custom 403 page.
      res
        .status(400)
        .send('Bad request')
      return
    }

    // Handle 401
    if (error.status === 401) {
      // Display a custom 403 page.
      res
        .status(401)
        .send('Unauthorized')
      return
    }

    res
      .status(error.status || 500)
      .send('An internal error has occurred.')
  })

  // Start the HTTP server listening for connections.
  const server = app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${server.address().port}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (error) {
  console.error(error)
  process.exitCode = 1
}