import { AuthenticationError, ForbiddenError } from 'apollo-server-express'

export function secure (func, admin = false, moderator = false) {
  return (root, args, context) => {
    if (!context.user) throw new AuthenticationError('Unauthenticated')
    // admin only
    if ((admin && !moderator) && !context.user.admin) {
      throw new ForbiddenError('Unauthorized')
    // admin or moderator only
    } else if ((admin && moderator) && (!context.user.admin && !context.user.moderator)) {
      throw new ForbiddenError('Unauthorized')
    }
    return func(root, args, context)
  }
}
