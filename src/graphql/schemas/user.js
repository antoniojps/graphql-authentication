import { gql } from 'apollo-server-express'
import { secure } from './../../utils/filters/graphql'
import User from './../../models/user'

export const typeDef = gql`
  # Directives
  directive @auth(requires: Role = user) on FIELD_DEFINITION
  enum Role {
    admin
    moderator
    owner
    user
  }

  type User {
    _id: ID!
    email: String @auth(requires: owner)
    username: String
    name: String
    surname: String
    providers: [Provider] @auth(requires: owner)
    avatar: Avatar
    admin: Boolean
    moderator: Boolean
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Provider {
    provider: String
    id: ID
  }

  type Avatar {
    small: String
    medium: String
    large: String
  }

  extend type Query {
    # Currently logged user data
    currentUser: User @cacheControl(maxAge: 0)
    # (Admin) All users
    users: [User]
    # User by id
    user(id: ID!): User
  }
`

export const resolvers = {
  Query: {
    // User
    users: secure(() => User.find(), true),
    user: (root, { id }) => User.findById(id),
    currentUser: secure((root, args, { user }) => User.findById(user.id)),
  },
}
