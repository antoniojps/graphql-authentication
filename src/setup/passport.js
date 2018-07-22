import passport from 'passport'
import passportGoogle from 'passport-google-oauth'
import passportSteam from 'passport-steam'
import passportDiscord from 'passport-discord'
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
        const {
          _json: { steamid },
        } = profile

        let user = await User.findOrCreate(null, steamid, provider, profile)

        done(null, user)
      } catch (e) {
        done(e)
      }
    })
  )
}

function setupDiscordStrategy () {
  const passportConfig = {
    callbackURL: '/auth/discord/redirect',
    clientID: process.env.DISCORD_CLIENTID,
    clientSecret: process.env.DISCORD_CLIENTSECRET,
  }

  const provider = 'discord'

  passport.use(
    new passportDiscord.Strategy(passportConfig, async function (
      accessToken,
      refreshToken,
      profile,
      done
    ) {
      try {
        const { email, id } = profile
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
  setupSteamStrategy()
  setupDiscordStrategy()
}
