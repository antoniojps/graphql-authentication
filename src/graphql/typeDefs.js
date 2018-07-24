import { gql } from 'apollo-server-express'

const typeDefs = gql`

  type User {
    _id: ID!
    email: String
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
  }
`

export default typeDefs
