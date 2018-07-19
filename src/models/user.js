import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
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
  password: {
    type: String,
    require: true,
    minlength: 6,
  },
})

// model methods
UserSchema.statics = {
  findByCredentials (email, password) {
    return User.findOne({ email }).then(async user => {
      if (!user) return Promise.reject(new Error('user invalid'))
      const isPasswordCorrect = await bcrypt.compare(password, user.password)
      if (!isPasswordCorrect) {
        return Promise.reject(new Error('user password incorrect'))
      }
      return user
    })
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
      .sign({ _id: this._id.toHexString() }, process.env.JWT_SECRET)
      .toString()
    return token
  },
}

// middleware
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await encryptPassword(this.password)
    next()
  }
  next()
})

async function encryptPassword (password) {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    return hashPassword
  } catch (e) {
    return e
  }
}

// model
const User = mongoose.model('User', UserSchema)

export default User
