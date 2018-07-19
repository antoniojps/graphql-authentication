import express from 'express'
import {
  bodyParser,
  cors,
  authenticate,
  handleAuthError,
} from './../middleware/middleware'
import schema from './../graphql/schema'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'

const app = express()

app.use(cors(), bodyParser.json(), authenticate, handleAuthError)

app.use(
  '/graphql',
  graphqlExpress(req => ({
    schema,
    context: {
      user: req.user,
    },
  }))
)

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

app.listen(process.env.PORT, () =>
  console.info(`Server started on port ${process.env.PORT}`)
)
