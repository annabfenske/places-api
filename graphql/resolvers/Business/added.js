import { isBusinessAdded } from '../../../db/businesses'

export default (parent, args, context, info) => {
  try {
    if (context.warden && context.warden.isAuthenticated()) {
      return isBusinessAdded(context.warden.user.id, parent.id)
    }
    return false
  } catch (err) {
    console.log('Business.added error: ', err)
    return false
  }
}