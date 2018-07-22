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
    }

    const user = new User(newUser)
    return user.save()
  },
}

// instance methods
UserSchema.methods = {
  toJSON () {
    const userObj = this.toObject()
    return userObj
  },

  generateAuthToken () {
    const token = jsonwebtoken
      .sign({}, process.env.JWT_SECRET, {
        expiresIn: '24h',
        audience: process.env.JWT_AUDIENCE,
        issuer: process.env.JWT_ISSUER,
        subject: this._id.toHexString(),
      })
      .toString()
    return token
  },
}

// model
const User = mongoose.model('User', UserSchema)

export default User
