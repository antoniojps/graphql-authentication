import { ObjectID } from 'mongodb'
import User from '../../models/user'
import jsonwebtoken from 'jsonwebtoken'

const userOneID = new ObjectID()
const userTwoID = new ObjectID()

function generateAuthToken (id, admin, moderator) {
  const token = jsonwebtoken
    .sign(
      {
        id,
        admin: !!admin,
        moderator: !!moderator,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h',
        audience: process.env.JWT_AUDIENCE,
        issuer: process.env.JWT_ISSUER,
        subject: id,
      }
    )
    .toString()
  return token
}

export const defaultUsers = [
  {
    _id: userOneID,
    email: 'userOne@mail.com',
    password: 'userOnePass',
  },
  {
    _id: userTwoID,
    email: 'userTwo@mail.com',
    password: 'userTwoPass',
  },
]

export const usersTokens = [
  generateAuthToken(defaultUsers[0]._id.toHexString(), true),
  generateAuthToken(defaultUsers[1]._id.toHexString()),
]

export const populateUsers = done => {
  User.remove().then(() => {
    const userOne = new User(defaultUsers[0]).save()
    const userTwo = new User(defaultUsers[1]).save()
    Promise.all([userOne, userTwo]).then(() => done())
  })
}
