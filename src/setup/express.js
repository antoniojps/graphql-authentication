import express from 'express'
import {
  cookieParser,
  jwtParser,
  handleJwtError,
  passport,
} from './../middleware/middleware'
import typeDefs from './../graphql/typeDefs'
import resolvers from './../graphql/resolvers'
import { ApolloServer } from 'apollo-server-express'
import authRoutes from './routes/auth'

function setupGraphQL () {
  return new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // todo: get user roles from db and add to user obj
      return { user: req.user }
    },
    tracing: true,
    cacheControl: true,
    // playground not sending cookies? https://github.com/prismagraphql/graphql-playground/issues/748
    playground: {
      settings: {
        'editor.theme': 'light',
        'request.credentials': 'include',
      },
      tabs: [
        {
          endpoint: '/graphql',
          query: '{ currentUser { email } }',
        },
      ],
    },
  })
}

function setupParsers (app) {
  app.use(cookieParser())
  app.use(process.env.GRAPHQL_ENDPOINT, jwtParser, handleJwtError)
}

function setupPassport (app) {
  app.use(passport.initialize())
}

function setupRoutes (app) {
  app.use('/auth', authRoutes)
}

function setupExpress () {
  const app = express()

  // express middleware
  setupParsers(app)
  setupPassport(app)
  setupRoutes(app)

  // graphQL
  const server = setupGraphQL()
  server.applyMiddleware({
    app,
    path: process.env.GRAPHQL_ENDPOINT,
    cors: {
      origin: [process.env.CLIENT_ORIGIN],
      credentials: true,
    },
  })

  app.listen({ port: process.env.PORT }, () =>
    console.info(`Server started on port ${process.env.PORT}`)
  )
  return app
}

export default setupExpress
