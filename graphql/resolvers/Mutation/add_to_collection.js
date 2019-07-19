import { canUserAddToCollection } from '../../../lib/acl/collection'
import { addBusinessToCollection } from '../../../db/businesses'
import { getCollectionById } from '../../../db/collections'

export default async (root, args, context, info) => {
  try {
    if (!context.warden.isAuthenticated()) {
      return {
        success: false,
        message: 'Not authenticated!'
      }
    }

    let isAble = await canUserAddToCollection(context.warden.user.id, args)
    if (isAble !== true) {
      return {
        success: false,
        message: isAble
      }
    }

    await addBusinessToCollection(args.business_id, args.collection_id)
    
    let collection = await getCollectionById(args.collection_id, [
      'id',
      'name',
      'icon_id',
      'color_id'
    ])

    if (collection) {
      return {
        success: true,
        collection
      }
    }

    return {
      success: false,
      message: 'Unable to add this location to this collection.'
    }

  } catch (err) {
    console.log('Mutation.add_to_collection error: ', err)
    return {
      success: false,
      message: 'An unexpected error occurred.'
    }
  }
}