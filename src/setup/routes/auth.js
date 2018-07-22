import { Router } from 'express'
import './../passport'
import passport from 'passport'
import { handlePassportError } from './../../middleware/middleware'

const router = Router()

router.get('/login', (req, res) => {
  res.send('Login')
})

// auth with google
router.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  })
)

// callback route for google to redirect to
router.get(
  '/google/redirect',
  passport.authenticate('google', { session: false }),
  handlePassportError,
  (req, res) => {
    res.send({ user: req.user, token: req.token })
  }
)

router.get(
  '/steam',
  passport.authenticate('steam', {
    session: false,
  })
)

router.get(
  '/steam/redirect',
  passport.authenticate('steam', { session: false }),
  handlePassportError,
  (req, res) => {
    if (!req.user) res.status(404).send('NOT FOUND')
    res.send({
      results: { user: req.user },
      status: 'OK',
    })
  }
)

export default router
