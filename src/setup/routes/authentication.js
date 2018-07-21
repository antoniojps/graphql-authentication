import { Router } from 'express'
import './../passport'
import passport from 'passport'

const router = Router()

router.get('/signup', (req, res) => {
  res.redirect('/auth/google')
})

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
  (req, res) => {
    res.send({ user: req.user, token: req.token })
  }
)

export default router
