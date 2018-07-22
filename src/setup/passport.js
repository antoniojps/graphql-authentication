import passport from 'passport'
import passportGoogle from 'passport-google-oauth'
import User from './../models/user'

const passportConfig = {
  callbackURL: '/auth/google/redirect',
  clientID: process.env.GOOGLE_CLIENTID,
  clientSecret: process.env.GOOGLE_CLIENTSECRET,
}

const provider = 'google'

export default function () {
  if (passportConfig.clientID) {
    passport.use(
      new passportGoogle.OAuth2Strategy(passportConfig, async function (
        request,
        accessToken,
        refreshToken,
        profile,
        done
      ) {
        try {
          let user = await User.findByExternalID(provider, profile.id)
          if (!user) {
            user = await User.createUser(provider, profile)
            console.log('created new user')
          }
          const token = user.generateAuthToken()
          done(null, { user, token })
        } catch (e) {
          done(e)
        }
      })
    )
  }
}
