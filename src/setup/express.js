import express from 'express'
import {
  cors,
  authenticate,
  handleAuthError,
} from './../middleware/middleware'
import typeDefs from './../graphql/typeDefs'
import resolvers from './../graphql/resolvers'
import { ApolloServer } from 'apollo-server-express'

const app = express()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // todo: get user roles from db and add to user obj
    return { user: req.user }
  },
})

app.use(cors(), authenticate, handleAuthError)

server.applyMiddleware({ app })

app.listen({ port: process.env.PORT }, () =>
  console.info(`Server started on port ${process.env.PORT}`)
)
