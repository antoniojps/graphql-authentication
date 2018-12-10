import { secure } from './../utils/filters/graphql'
import User from './../models/user'

export default {
  Query: {
    users: secure(() => User.find(), true),
    user: (root, { id }) => User.findById(id),
    currentUser: secure((root, args, { user }) => {
      return User.findById(user.id)
    }),
  },
}
