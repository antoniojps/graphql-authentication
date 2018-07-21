import { ObjectID } from 'mongodb'
import User from '../../models/user'
import jsonwebtoken from 'jsonwebtoken'

const userOneID = new ObjectID()
const userTwoID = new ObjectID()

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
  jsonwebtoken.sign({ _id: userOneID }, process.env.JWT_SECRET).toString(),
  jsonwebtoken.sign({ _id: userTwoID }, process.env.JWT_SECRET).toString(),
]

export const populateUsers = done => {
  User.remove().then(() => {
    const userOne = new User(defaultUsers[0]).save()
    const userTwo = new User(defaultUsers[1]).save()
    Promise.all([userOne, userTwo]).then(() => done())
  })
}
