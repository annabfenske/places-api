import { getBusinessesByCollectionId } from '../../../db/businesses'

export default (parent, args, context, info) => {
  try {
    if (context.warden && context.warden.isAuthenticated()) {
      return getBusinessesByCollectionId(parent.id, args)
    }
    return null
  } catch (err) {
    console.log('Collection.places error: ', err)
    return null
  }
}