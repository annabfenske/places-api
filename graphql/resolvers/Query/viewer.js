export default async (root, args, context, info) => {
  const { warden } = context
  try {
    if (!warden.isAuthenticated()) {
      return null
    }

    return {
      id: warden.user.id,
      email: warden.user.email,
      first_name: warden.user.first_name,
      last_name: warden.user.last_name
    }
  } catch (err) {
    console.log('viewer error: ', err)
    return err
  }
}