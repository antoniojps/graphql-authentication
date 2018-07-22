import passport from 'passport'
import passportGoogle from 'passport-google-oauth'
import passportSteam from 'passport-steam'
import User from './../models/user'

function setupGoogleStrategy () {
  const passportConfig = {
    callbackURL: '/auth/google/redirect',
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_CLIENTSECRET,
  }

  const provider = 'google'

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

function setupSteamStrategy () {
  const passportConfig = {
    returnURL: `${process.env.PUBLIC_URL}/auth/steam/redirect`,
    realm: process.env.PUBLIC_URL,
    apiKey: process.env.STEAM_APIKEY,
  }

  const provider = 'steam'

  passport.use(
    new passportSteam.Strategy(passportConfig, async function (
      id,
      profile,
      done
    ) {
      try {
        const { _json: { steamid } } = profile
        let user = await User.findByExternalID(provider, steamid)
        if (!user) {
          user = await User.createUser(provider, profile)
          console.log('created new user')
        }
        const token = user.generateAuthToken()
        user = user.toJSON()

        done(null, { ...user, token })
      } catch (e) {
        done(e)
      }
    })
  )
}

export default function () {
  setupGoogleStrategy()
  setupSteamStrategy()
}
