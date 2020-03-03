import cookieParser from 'cookie-parser'
import passport from 'passport'
import jwt from 'express-jwt'
import { errSchema } from './../utils/schemas/responses'
import session from 'express-session'

const jwtParser = jwt({
  credentialsRequired: false,
  secret: process.env.JWT_SECRET,
  audience: process.env.JWT_AUDIENCE,
  issuer: process.env.JWT_ISSUER,
  getToken: req => {
    if (req.cookies.token) return req.cookies.token
    return null
  },
})

// Make Apollo Server handle the unauthenticated users and not Express
function handleJwtError (err, req, res, next) {
  if (err.code === 'invalid_token') return next()
  return next(err)
}

function handlePassportError (err, req, res, next) {
  if (err) {
    let data = {}
    if (!(process.env.NODE_ENV === 'production')) {
      data.err = err
      res.status(500).send(errSchema(data, 500))
    }
  } else return next()
}

export {
  cookieParser,
  passport,
  jwtParser,
  handleJwtError,
  handlePassportError,
  session,
}
