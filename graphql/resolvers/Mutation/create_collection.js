import { createCollection } from '../../../db/collections'
import { canUserCreateCollection } from '../../../lib/acl/collection';

export default async (root, args, context, info) => {
  try {
    if (!context.warden.isAuthenticated()) {
      return {
        success: false,
        message: 'Not authenticated!'
      }
    }

    let isAble = await canUserCreateCollection(context.warden.user.id, args)
    if (isAble !== true) {
      return {
        success: false,
        message: isAble
      }
    }

    let collection = await createCollection({
      ...args,
      user_id: context.warden.user.id
    }, [
      'id',
      'name',
      'color_id',
      'icon_id'
    ])

    if (collection) {
      return {
        success: true,
        collection
      }
    }

    return {
      success: false,
      message: 'Unable to create collection.'
    }

  } catch (err) {
    console.log('Mutation.create_collection error: ', err)
    return {
      success: false,
      message: 'An unexpected error occurred.'
    }
  }
}