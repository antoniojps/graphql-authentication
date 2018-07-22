import cors from 'cors'
import passport from 'passport'
import jwt from 'express-jwt'

const authenticate = jwt({
  credentialsRequired: false,
  secret: process.env.JWT_SECRET,
  audience: process.env.JWT_AUDIENCE,
  issuer: process.env.ISSUER,
})

// Make Apollo Server handle the unauthenticated users and not Express
function handleAuthError (err, req, res, next) {
  if (err.code === 'invalid_token') return next()
  return next(err)
}

function handlePassportError (err, req, res, next) {
  if (err) {
    let data = {
      status: 'BAD REQUEST',
    }
    if (!(process.env.NODE_ENV === 'production')) data.err = err
    res.status(400).send(data)
  } else return next()
}

export { cors, passport, authenticate, handleAuthError, handlePassportError }
