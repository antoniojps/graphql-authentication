import express from 'express'
import { cors, authenticate, handleAuthError } from './../middleware/middleware'
import typeDefs from './../graphql/typeDefs'
import resolvers from './../graphql/resolvers'
import { ApolloServer } from 'apollo-server-express'

function setupGraphQL () {
  return new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // todo: get user roles from db and add to user obj
      return { user: req.user }
    },
  })
}

function setupCors (app) {
  app.use(cors())
}

function setupParsers (app) {
  app.use(authenticate, handleAuthError)
}

function setupExpress () {
  const app = express()

  // express middleware
  setupCors(app)
  setupParsers(app)

  // graphQL
  const server = setupGraphQL()
  server.applyMiddleware({ app })

  app.listen({ port: process.env.PORT }, () =>
    console.info(`Server started on port ${process.env.PORT}`)
  )
  return app
}

export default setupExpress
