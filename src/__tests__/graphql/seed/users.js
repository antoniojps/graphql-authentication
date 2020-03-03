import { ObjectID } from 'mongodb'
import User from './../../../models/user'
import jsonwebtoken from 'jsonwebtoken'

const userOneID = new ObjectID()
const userTwoID = new ObjectID()
const userThreeID = new ObjectID()
const userFourID = new ObjectID()

export function generateAuthToken (id, admin, moderator) {
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

export const defaultUsers = {
  admin: {
    _id: userOneID,
    email: 'userOne@mail.com',
    username: 'admin',
  },
  moderator: {
    _id: userThreeID,
    email: 'userThree@mail.com',
    username: 'moderator',
  },
  normal: {
    _id: userTwoID,
    email: 'userTwo@mail.com',
    username: 'normal',
    password: 'userTwoPass',
  },
  normalAlt: {
    _id: userFourID,
    email: 'userFour@mail.com',
    username: 'normalFour',
  },
}

export const usersTokens = {
  admin: generateAuthToken(defaultUsers.admin._id.toHexString(), true),
  moderator: generateAuthToken(
    defaultUsers.moderator._id.toHexString(),
    false,
    true
  ),
  normal: generateAuthToken(defaultUsers.normal._id.toHexString()),
  normalAlt: generateAuthToken(defaultUsers.normalAlt._id.toHexString()),
}

export const populateUsers = () => {
  return new Promise(resolve => {
    User.deleteMany({}).then(() => {
      const createUsers = Object.keys(defaultUsers).map(key =>
        new User(defaultUsers[key]).save()
      )
      Promise.all(createUsers).then(() => {
        resolve()
      })
    })
  })
}
