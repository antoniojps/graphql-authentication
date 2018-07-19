import path from 'path'
import fs from 'fs'
import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolvers'

const typeDefs = fs.readFileSync(path.resolve(__dirname, './schema.gql'), {
  encoding: 'utf-8',
})

const schema = makeExecutableSchema({ typeDefs, resolvers })

export default schema
