import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type Query {
    user(id: ID!): User
    users: [User]
  }

  type Mutation {
    signup(input: signupInput): User
  }

  type User {
    _id: ID!
    email: String
    password: String
    token: String
  }

  input signupInput {
    email: String!
    password: String!
  }
`

export default typeDefs
