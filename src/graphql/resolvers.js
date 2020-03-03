import merge from 'lodash.merge'
import { resolvers as UserResolvers } from './schemas/user'

import {
  DateTime,
  PositiveInt,
  EmailAddress,
  URL,
} from '@okgrow/graphql-scalars'
import jsonScalar from 'graphql-type-json'

const setupResolvers = {
  // scalars
  DateTime,
  PositiveInt,
  EmailAddress,
  URL,
  JSON: jsonScalar,

  Query: {},

  Mutation: {},
}

const resolvers = merge(
  setupResolvers,
  UserResolvers,
)

export default resolvers
