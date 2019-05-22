import { nomNom, authenticate } from "../../../lib/auth"

export default async (root, args, context, info) => {
  const { warden } = context
  try {
    if (warden.isAuthenticated()) {
      nomNom(context.res)
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
        message: authResult.error || 'Unable to process your request.'
      }
    }

    return {
      success: true,
      message: 'User successfully authenticated.',
      viewer: authResult.user,
      token: authResult.token
    }
  } catch (err) {
    console.log('login error: ', err)
    return err
  }
}