export default async (root, args, context, info) => {
  try {
    if (!context.warden.isAuthenticated()) {
      return null
    }

    return {
      id: context.warden.user.id,
      email: context.warden.user.email,
      first_name: context.warden.user.first_name,
      last_name: context.warden.user.last_name
    }
  } catch (err) {
    console.log('viewer error: ', err)
    return err
  }
}