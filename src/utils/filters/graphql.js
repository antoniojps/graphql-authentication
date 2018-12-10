import { AuthenticationError, ForbiddenError } from 'apollo-server-express'

export function secure (func, admin = false, moderator = false) {
  return (root, args, context) => {
    if (!context.user) throw new AuthenticationError('Unauthenticated')
    // admin only
    if (admin && !moderator && !context.user.admin) {
      throw new ForbiddenError('Unauthorized')
    // admin or moderator only
    } else if (
      admin &&
      moderator &&
      (!context.user.admin && !context.user.moderator)) {
      throw new ForbiddenError('Unauthorized')
    }
    return func(root, args, context)
  }
}

export function secureUserOnly (func, userId = 'userId') {
  return (root, args, context) => {
    if (!context.user) throw new AuthenticationError('Unauthenticated')
    else if (
      !context.user.admin &&
      !context.user.moderator &&
      args[userId] !== context.user.id
    ) {
      throw new ForbiddenError('Unauthorized')
    }
    return func(root, args, context)
  }
}

// With Connection, Edges, PageInfo and Count
// https://graphql.org/learn/pagination/
export async function paginate (Model, query, pagination) {
  const { limit } = pagination
  const totalCount = await Model.find(query).countDocuments()

  if (totalCount === 0) {
    return {
      totalCount,
      pageInfo: {
        hasNextPage: false,
      },
    }
  }

  const documents = await Model.find(query)
    .sort({ createdAt: 1 })
    .limit(limit)

  const edges = documents.map(user => ({
    node: user,
    cursor: user.createdAt,
  }))

  const lastNode = edges[edges.length - 1].node
  const endCursor = lastNode.createdAt

  const hasNextPage = edges.length === limit

  const pageInfo = {
    hasNextPage,
    endCursor,
  }

  return {
    totalCount,
    edges,
    pageInfo,
  }
}
