import bcrypt from 'bcrypt'

import {
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'
import Viewer from '../types/Viewer'
import AuthResponse from '../types/AuthResponse'

import {
  createUser,
  getUserByEmail
} from '../../db/users'
import { authenticate } from '../../lib/auth'
import { ADMIN_EMAIL } from '../../lib/constants'

export default {
  create_user: {
    description: 'Sign up as/Create a new user',
    type: new GraphQLNonNull(AuthResponse),
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
      },
      authenticate: {
        type: new GraphQLNonNull(GraphQLBoolean)
      }
    },
    resolve: async (warden, args, context, info) => {
      try {
        if (args.authenticate && warden.isAuthenticated()) {
          return {
            success: false,
            message: 'Please log out before signing up as a new user.'
          }
        }

        // TODO: create admin user with sole privilege to create new users
        if (!args.authenticate && warden.email !== ADMIN_EMAIL) {
          return {
            success: false,
            message: 'You are not authorized to create new users.'
          }
        }

        let userExists = await getUserByEmail(args.email)
        if (userExists) {
          return {
            success: false,
            message: 'This email has already been taken.'
          }
        }

        let hashedPassword = await bcrypt.hash(args.password, 10)
        let newUser = {
          first_name: args.first_name,
          last_name: args.last_name,
          email: args.email,
          password: hashedPassword
        }

        let { id } = await createUser(newUser)
        if (!id) {
          return {
            success: false,
            message: 'User creation failed'
          }
        }

        // TODO: authenticate
        let token, viewer

        if (args.authenticate) {
          let authResult = await authenticate(
            args.email,
            args.password,
            warden,
            context
          )

          if (authResult.error || !authResult.token || !authResult.user) {
            return {
              success: false,
              message: authResult.error || 'Unable to log in.'
            }
          }

          token = authResult.token
          viewer = authResult.user
        }

        return {
          success: true,
          message: 'User successfully created',
          token,
          viewer
        }

      } catch (err) {
        console.log('create_user error: ', err)
        return err
      }
    }
  },
  login: {
    description: 'Log in as a user of the app',
    type: new GraphQLNonNull(AuthResponse),
    args: {
      email: {
        type: new GraphQLNonNull(GraphQLString)
      },
      password: {
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async (warden, args, context, info) => {
      try {
        if (warden.isAuthenticated()) {
          return {
            success: false,
            message: 'You are already logged in!'
          }
        }

        let authResult = await authenticate(
          args.email,
          args.password,
          warden,
          context
        )

        if (authResult.error || !authResult.token || !authResult.user) {
          return {
            success: false,
            message: authResult.error || 'Unable to log in.'
          }
        }

        return {
          success: true,
          message: 'User successfully authenticated',
          viewer: authResult.user,
          token: authResult.token
        }

      } catch (err) {
        console.log('login error: ', err)
        return err
      }
    }
  }
}
