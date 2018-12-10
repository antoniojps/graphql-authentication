import { defaultFieldResolver } from 'graphql'
import {
  SchemaDirectiveVisitor,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server-express'

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition (field) {
    // destructuring the `resolve` property off of `field`, while providing a default value `defaultFieldResolver` in case `field.resolve` is undefined.
    const { resolver = defaultFieldResolver, name } = field
    const { requires } = this.args
    const whitelistOperations = [
      'currentUser',
    ]

    field.resolve = async function (source, args, context, info) {
      const {
        variableValues: { id },
      } = info
      const operation = info.operation.selectionSet.selections[0].name.value

      if (!whitelistOperations.includes(operation)) {
        if (!context.user) {
          throw new AuthenticationError(`Unauthenticated field ${name}`)
        }
        if (requires === 'admin' && !context.user.admin) {
          throw new ForbiddenError(`Unauthorized field ${name}`)
        }
        if (
          requires === 'moderator' &&
          !context.user.admin &&
          !context.user.moderator
        ) {
          throw new ForbiddenError(`Unauthorized field ${name}`)
        }
        if (
          requires === 'owner' &&
          !context.user.admin &&
          !context.user.moderator &&
          id !== context.user.id
        ) {
          throw new ForbiddenError(`Unauthorized field ${name}`)
        }
      }

      const result = await resolver.call(this, source, args, context, info)
      return result
    }
  }
}

export { AuthDirective }
