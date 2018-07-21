import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type Query {
    user(id: ID!): User
    users: [User]
  }

  type User {
    _id: ID!
    email: String
    username: String
    providers: [Provider]
  }

  type Provider {
    provider: String
    id: ID
  }
`

export default typeDefs
