import { AuthenticationError, ForbiddenError } from 'apollo-server-express'

export function secure (func, admin = false, moderator = false) {
  return (root, args, context) => {
    if (!context.user) throw new AuthenticationError('Unauthenticated')
    if (
      (admin && !context.user.admin) ||
      (moderator && !context.user.moderator)
    ) {
      throw new ForbiddenError('Unauthorized')
    }
    return func(root, args, context)
  }
}
