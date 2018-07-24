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
    // todo redirect users to client accordingly
    if (!req.user) res.status(404).send(errSchema('User not found', 404))
    res.cookie('token', req.user.token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
    })
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
    // todo redirect users to client accordingly
    if (!req.user) res.status(404).send(errSchema('User not found', 404))
    res.cookie('token', req.user.token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
    })
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
    // todo redirect users to client accordingly
    if (!req.user) res.status(404).send(errSchema('User not found', 404))
    res.cookie('token', req.user.token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
    })
    res.send(resSchema(req.user, res.statusCode))
  }
)

export default router
