import { Router } from 'express'
import cors from 'cors'
import './../passport'
import passport from 'passport'
import { handlePassportError } from './../../middleware/middleware'
import { resSchema, errSchema } from './../../utils/schemas/responses'

const router = Router()

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
    if (!req.user) res.send(errSchema('User not found', 404))
    if (req.user) {
      res.cookie('token', req.user.token, {
        // 1 week
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      })
    }
    res.send(resSchema({ ...req.user }, 200))
    // res.redirect(process.env.CLIENT_REDIRECT)
  }
)

router.get(
  '/logout',
  cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }),
  (req, res) => {
    // 42 is the answer to life, the universe and everything
    res.cookie('token', '', {
      expires: new Date(Date.now() - 42),
      httpOnly: true,
    })
    res.send(resSchema({ logout: true }, 200))
  }
)

export default router
