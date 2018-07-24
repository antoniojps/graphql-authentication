import mongoose from 'mongoose'
import validator from 'validator'
import jsonwebtoken from 'jsonwebtoken'

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
    default: false,
  },
  moderator: {
    type: Boolean,
    default: false,
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
  createUser (provider, profile) {
    let newUser

    if (provider === 'google') {
      newUser = {
        email: profile.emails[0].value,
        providers: [
          {
            provider,
            id: profile.id,
          },
        ],
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
    } else if (provider === 'discord') {
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
    }

    const user = new User(newUser)
    return user.save()
  },
  async findOrCreate (email, id, provider, profile) {
    try {
      let user
      if (email) user = await this.findByEmail(email)
      if (!user) user = await this.findByExternalID(provider, id)
      if (!user) {
        user = await this.createUser(provider, profile)
        console.log(`created new ${provider} user`)
      }
      console.log(user)
      const token = user.generateAuthToken()
      return { user, token }
    } catch (e) {
      return Promise.reject(new Error(e))
    }
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
