import { gql } from 'apollo-server-express'

export const typeDef = gql`
  # Pagination
  type PaginationInfo {
    hasNextPage: Boolean!
    endCursor: DateTime
  }

  input PaginationInput {
    limit: Int = 10
    after: DateTime
  }
`
