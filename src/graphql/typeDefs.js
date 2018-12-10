import { gql } from 'apollo-server-express'

const typeDefs = gql`
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
    email: String @auth(requires:owner)
    username: String
    providers: [Provider]
    admin: Boolean
    moderator: Boolean
  }

  type Provider {
    provider: String
    id: ID
  }

  type Query {
    # Currently logged user data
    currentUser: User @cacheControl(maxAge: 0)
    # (Admin) All users
    users: [User]
    # User by id
    user(id: ID!): User
  }
`

export default typeDefs
