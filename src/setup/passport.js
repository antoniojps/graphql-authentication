import passport from 'passport'
import passportGoogle from 'passport-google-oauth'
import User from './../models/user'

const passportConfig = {
  callbackURL: '/auth/google/redirect',
  clientID:
    '32006896534-tlihspvefscesq8er14vpq55dvat62po.apps.googleusercontent.com',
  clientSecret: 'FJSSEAj-ypkPuc73JPmCN1D9',
}

const provider = 'google'

if (passportConfig.clientID) {
  passport.use(
    new passportGoogle.OAuth2Strategy(passportConfig, async function (
      request,
      accessToken,
      refreshToken,
      profile,
      done
    ) {
      let user = await User.findByExternalID(provider, profile.id)
      // if no user register
      if (!user) {
        user = await User.createUser(provider, profile)
        console.log('created new user')
      }

      const token = user.generateAuthToken()

      return done(null, { user, token })
    })
  )
}
