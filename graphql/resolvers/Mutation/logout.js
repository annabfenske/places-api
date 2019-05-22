import { nomNom } from "../../../lib/auth";

export default async (root, args, context, info) => {
  const { res } = context
  try {
    nomNom(res)
    return {
      success: true,
      message: 'User successfully logged out.'
    }
  } catch (err) {
    console.log('logout error: ', err)
    return err
  }
}