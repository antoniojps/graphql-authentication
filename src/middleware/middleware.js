import bodyParser from 'body-parser'
import cors from 'cors'
import jwt from 'express-jwt'

const authenticate = jwt({
  credentialsRequired: false,
  secret: process.env.JWT_SECRET,
})

const handleAuthError = (err, req, res, next) => {
  if (err.code === 'invalid_token') return next()
  return next(err)
}

export {
  bodyParser,
  cors,
  authenticate,
  handleAuthError,
}
