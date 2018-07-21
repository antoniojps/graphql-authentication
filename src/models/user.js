import mongoose from 'mongoose'
import validator from 'validator'
import jsonwebtoken from 'jsonwebtoken'
import _ from 'lodash'

// USER
// schema
const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
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
    const newUser = {
      email: profile.emails[0].value,
      providers: [
        {
          provider,
          id: profile.id,
        },
      ],
    }
    const user = new User(newUser)
    return user.save()
  },
}

// instance methods
UserSchema.methods = {
  toJSON () {
    const userObj = this.toObject()
    return _.pick(userObj, ['_id', 'email'])
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
