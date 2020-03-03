import express from 'express'
import {
  cookieParser,
  jwtParser,
  handleJwtError,
  passport,
  session,
} from './../middleware/middleware'
import typeDefs from './../graphql/typeDefs'
import resolvers from './../graphql/resolvers'
import { AuthDirective } from './../graphql/directives'
import { ApolloServer } from 'apollo-server-express'
import authRoutes from './routes/auth'

function setupGraphQL () {
  return new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives: {
      auth: AuthDirective,
    },
    context: ({ req }) => {
      return { user: req.user }
    },
    tracing: true,
    cacheControl: true,
    formatError: error => {
      if (process.env.NODE_ENV === 'production') {
        console.log(error)
      }
      return error
    },
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
  // necessary for OAuth 1.0 :(
  // it ends up not being used at all
  app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === 'production' },
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())
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

  const expressServer = app.listen({ port: process.env.PORT }, () =>
    console.info(`Server started on port ${process.env.PORT}`)
  )
  return {
    app,
    expressServer,
  }
}

export default setupExpress
