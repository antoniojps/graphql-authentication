import { secure } from './../utils/filters/graphql'
import User from './../models/user'

export default {
  Query: {
    users: secure(() => User.find(), true),
    currentUser: secure((root, args, { user }) => {
      return User.findById(user.id)
    }),
  },
}
