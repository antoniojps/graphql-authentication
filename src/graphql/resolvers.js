import {
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server-express'
import User from './../models/user'

const Query = {
  users: (root, { input }, { user }) => {
    // todo: set up user roles
    if (!user) throw new AuthenticationError('Unauthorized')
    return User.find()
  },
}

const Mutation = {
  signup: async (root, { input }, { user }) => {
    if (user) throw new ForbiddenError('Cannot be logged in to signup')

    const existingUser = await User.findOne({ email: input.email })
    if (existingUser) throw new Error('Email already used')

    const newUser = new User(input)
    await newUser.save()

    const token = newUser.generateAuthToken()

    return {
      ...newUser.toJSON(),
      token,
    }
  },
}

export default { Query, Mutation }
