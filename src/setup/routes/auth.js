import { Router } from 'express'
import './../passport'
import passport from 'passport'
import { handlePassportError } from './../../middleware/middleware'
import { resSchema, errSchema } from './../../utils/responses'

const router = Router()

router.get('/login', (req, res) => {
  res.send('Login')
})

// GOOGLE
router.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  })
)

router.get(
  '/google/redirect',
  passport.authenticate('google', {
    failureRedirect: process.env.CLIENT_LOGIN,
    session: false,
  }),
  handlePassportError,
  (req, res) => {
    if (!req.user) res.status(404).send(errSchema('User not found', 404))
    res.send(resSchema(req.user, res.statusCode))
  }
)

// STEAM
router.get(
  '/steam',
  passport.authenticate('steam', {
    session: false,
  })
)

router.get(
  '/steam/redirect',
  passport.authenticate('steam', {
    failureRedirect: process.env.CLIENT_LOGIN,
    session: false,
  }),
  handlePassportError,
  (req, res) => {
    if (!req.user) res.status(404).send(errSchema('User not found', 404))
    res.send(resSchema(req.user, res.statusCode))
  }
)

// DISCORD

router.get(
  '/discord',
  passport.authenticate('discord', {
    session: false,
    scope: ['email', 'identify'],
  })
)

router.get(
  '/discord/redirect',
  passport.authenticate('discord', {
    failureRedirect: process.env.CLIENT_LOGIN,
    session: false,
  }),
  handlePassportError,
  (req, res) => {
    if (!req.user) res.status(404).send(errSchema('User not found', 404))
    res.cookie('token', req.user.token, {
      // // might be needed for subdomains
      // domain: process.env.CLIENT_ORIGIN,
      httpOnly: (process.env.NODE_ENV === 'production'),
    })
    res.send(resSchema(req.user, res.statusCode))
  }
)

export default router
