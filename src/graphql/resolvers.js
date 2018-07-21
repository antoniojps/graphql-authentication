import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import User from './../models/user'

const Query = {
  users: (root, args, { user }) => {
    // todo: set up user roles
    if (!user) throw new AuthenticationError('Unauthorized')
    return User.find()
  },
}

// const Mutation = {}

export default { Query }
