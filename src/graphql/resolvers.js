import User from './../models/user'

// const Query = {
//   user: (root, { id }) => db.users.get(id),
//   users: () => db.users.list(),
// }

const Mutation = {
  signup: async (root, { input }, { user }) => {
    console.log('not reaching resolver')
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

export default { Mutation }
