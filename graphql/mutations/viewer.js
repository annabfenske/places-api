import {
  GraphQLString,
  GraphQLNonNull
} from 'graphql'
import Viewer from '../types/Viewer'
import { createUser } from '../../db/users'

export default {
  sign_up: {
    description: 'Sign up as a new user',
    type: Viewer,
    args: {
      first_name: {
        type: new GraphQLNonNull(GraphQLString)
      },
      last_name: {
        type: new GraphQLNonNull(GraphQLString)
      },
      email: {
        type: new GraphQLNonNull(GraphQLString)
      },
      password: {
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async (warden, args, context, info) => {
      if (warden.isAuthenticated()) {
        return new Error('Please log out before signing up as a new user.')
      }

      // let { id } = await createUser(args)

      // TODO: authenticate
    }
  }
}
