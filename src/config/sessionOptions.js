// Setup and use session middleware (https://github.com/expressjs/session)
export const sessionOptions = Object.freeze({
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false, // Resave even if a request is not changing.
  saveUninitialized: false, // Don't save a created but not modified session.
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // One day.
    sameSite: 'strict'
  }
})
