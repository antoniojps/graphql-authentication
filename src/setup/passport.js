import passport from 'passport'
import passportGoogle from 'passport-google-oauth20'
import User from './../models/user'

function setupGoogleStrategy () {
  const passportConfig = {
    callbackURL: '/auth/google/redirect',
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_CLIENTSECRET,
  }

  const provider = 'google'

  passport.use(
    new passportGoogle.Strategy(passportConfig, async function (
      accessToken,
      refreshToken,
      profile,
      done
    ) {
      try {
        const { id } = profile
        const email = profile.emails[0].value
        let user = await User.findOrCreate(email, id, provider, profile)
        done(null, user)
      } catch (e) {
        done(e)
      }
    })
  )
}

export default function () {
  setupGoogleStrategy()
}
