import mongoose from 'mongoose'
import validator from 'validator'
import jsonwebtoken from 'jsonwebtoken'
import {
  getDiscordAvatarFromProfile,
  setGoogleAvatarSize,
} from './../utils/schemas/generators'

// USER
// schema
const UserSchema = mongoose.Schema({
  email: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  username: {
    type: String,
    trim: true,
  },
  admin: {
    type: Boolean,
    sparce: true,
  },
  moderator: {
    type: Boolean,
    sparce: true,
  },
  avatar: {
    type: {
      small: {
        type: String,
      },
      medium: {
        type: String,
      },
      large: {
        type: String,
      },
    },
    sparce: true,
  },
  providers: {
    type: [
      {
        provider: {
          type: String,
        },
        id: {
          type: String,
        },
        _id: false,
      },
    ],
  },
})

// model methods
UserSchema.statics = {
  findByExternalID (provider, id) {
    return User.findOne({
      providers: {
        $elemMatch: { provider, id },
      },
    })
  },
  findByEmail (email) {
    return User.findOne({
      email,
    })
  },
  newUserObj (provider, profile) {
    let newUser
    if (provider === 'google') {
      newUser = {
        email: profile.emails[0].value,
        username: profile.name.givenName,
        providers: [
          {
            provider,
            id: profile.id,
          },
        ],
      }
      if (profile.photos[0].value) {
        newUser.avatar = {
          small: setGoogleAvatarSize(profile.photos[0].value, 32),
          medium: setGoogleAvatarSize(profile.photos[0].value, 64),
          large: setGoogleAvatarSize(profile.photos[0].value, 184),
        }
      }
    } else if (provider === 'steam') {
      profile = profile._json
      newUser = {
        username: profile.personaname,
        providers: [
          {
            provider,
            id: profile.steamid,
          },
        ],
      }
      if (profile.avatar) {
        newUser.avatar = {
          small: profile.avatar,
          medium: profile.avatarmedium,
          large: profile.avatarfull,
        }
      }
    } else if (provider === 'discord') {
      const avatar = getDiscordAvatarFromProfile(profile)
      newUser = {
        username: profile.username,
        email: profile.email,
        providers: [
          {
            provider,
            id: profile.id,
          },
        ],
      }
      if (avatar) {
        newUser.avatar = {
          small: avatar,
          medium: avatar,
          large: avatar,
        }
      }
    }
    return newUser
  },
  createUser (provider, profile) {
    const newUser = this.newUserObj(provider, profile)
    const user = new User(newUser)
    return user.save()
  },
  async findOrCreate (email, id, provider, profile) {
    try {
      let user
      if (email) user = await this.findByEmail(email)
      if (!user) user = await this.findByExternalID(provider, id)
      if (user) user = await this.updateAvatar(user, provider, profile)
      if (!user) {
        user = await this.createUser(provider, profile)
        console.log(`created new ${provider} user: ${user.username}`)
      }
      const token = user.generateAuthToken()
      return { user, token }
    } catch (e) {
      return Promise.reject(new Error(e))
    }
  },
  async updateAvatar (user, provider, profile) {
    if (provider === 'google') {
      if (
        profile.photos[0].value &&
        user.avatar.small !== setGoogleAvatarSize(profile.photos[0].value, 32)
      ) {
        const avatar = {
          small: setGoogleAvatarSize(profile.photos[0].value, 32),
          medium: setGoogleAvatarSize(profile.photos[0].value, 64),
          large: setGoogleAvatarSize(profile.photos[0].value, 184),
        }
        try {
          const updatedUser = await this.findOneAndUpdate(
            {
              _id: user._id,
            },
            {
              $set: { avatar },
            },
            {
              new: true,
            }
          )
          return updatedUser
        } catch (e) {
          Promise.reject(new Error(e))
        }
      }
      return user
    } else if (provider === 'steam') {
      profile = profile._json
      if (profile.avatar && user.avatar.small !== profile.avatar) {
        const avatar = {
          small: profile.avatar,
          medium: profile.avatarmedium,
          large: profile.avatarfull,
        }
        try {
          const updatedUser = await this.findOneAndUpdate(
            {
              _id: user._id,
            },
            {
              $set: { avatar },
            },
            {
              new: true,
            }
          )
          return updatedUser
        } catch (e) {
          Promise.reject(new Error(e))
        }
      }
      return user
    } else if (provider === 'discord') {
      const newAvatar = getDiscordAvatarFromProfile(profile)
      if (newAvatar && user.avatar.small !== newAvatar) {
        const avatar = {
          small: newAvatar,
          medium: newAvatar,
          large: newAvatar,
        }
        try {
          const updatedUser = await this.findOneAndUpdate(
            {
              _id: user._id,
            },
            {
              $set: { avatar },
            },
            {
              new: true,
            }
          )
          return updatedUser
        } catch (e) {
          Promise.reject(new Error(e))
        }
      }
      return user
    }
    return user
  },
}

// instance methods
UserSchema.methods = {
  toObj () {
    const userObj = this.toObject()
    return userObj
  },

  generateAuthToken () {
    const user = this.toObj()

    const token = jsonwebtoken
      .sign(
        {
          id: user._id.toHexString(),
          admin: !!user.admin,
          moderator: !!user.moderator,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '24h',
          audience: process.env.JWT_AUDIENCE,
          issuer: process.env.JWT_ISSUER,
        }
      )
      .toString()
    return token
  },
}

// model
const User = mongoose.model('User', UserSchema)

export default User
