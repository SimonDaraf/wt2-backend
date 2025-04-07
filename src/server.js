/**
 * @file The starting point of the application.
 * @module src/server
 * @author Simon Danielsson
 * @version 1.0.0
 */

import express from 'express'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import logger from 'morgan'
import helmet from 'helmet'
import { serviceProvider } from './serviceProvider/serviceBuilder.js'
import session from 'express-session'
import { router } from './routes/router.js'
import { sessionOptions } from './config/sessionOptions.js'

try {
  console.log('Starting...')

  console.log('Creating application...')
  const app = express()
  const directoryFullName = dirname(fileURLToPath(import.meta.url))
  const baseURL = process.env.BASE_URL || '/'

  app.use(logger('dev'))
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https://secure.gravatar.com', 'https://gitlab.lnu.se']
      }
    }
  }))

  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())
  app.use(express.static(join(directoryFullName, '..', '/public')))

  app.use(session(sessionOptions))

  app.set('serviceProvider', serviceProvider)

  console.log('Setup middleware...')
  app.use((req, res, next) => {
    res.locals.baseURL = baseURL
    next()
  })

  console.log('Register routes...')
  app.use('/', router)

  app.use((error, req, res, next) => {
    console.error(error)

    // Handle 404
    if (error.status === 404) {
      // Display a custom 404 page.
      res
        .status(404)
      return
    }

    // Handle 403
    if (error.status === 403) {
      // Display a custom 403 page.
      res
        .status(403)
      return
    }

    // DEV ONLY
    res
      .status(error.status || 500)
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
