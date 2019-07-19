import bcrypt from 'bcrypt'

import { getUserByEmail, createUser } from "../../../db/users"
import { authenticate } from '../../../lib/auth'
import { ADMIN_EMAIL } from "../../../lib/constants"

export default async (root, args, context, info) => {
  try {
    if (args.authenticate && context.warden.isAuthenticated()) {
      return {
        success: false,
        message: 'Please log out before signing up as a new user.'
      }
    }

    if (!args.authenticate && context.warden.email !== ADMIN_EMAIL) {
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
        message: 'User creation failed.'
      }
    }

    // TODO: authenticated
    let token, user

    if (args.authenticate) {
      let authResult = await authenticate(
        args.email,
        args.password,
        context
      )

      if (authResult.error || !authResult.token || !authResult.user) {
        return {
          success: false,
          message: authResult.error || 'Unable to log in.'
        }
      }

      token = authResult.token
      user = authResult.user
    }

    return {
      success: true,
      message: 'User successfully created.',
      token,
      user
    }

  } catch (err) {
    console.log('create_user error: ', err)
    return err
  }
}