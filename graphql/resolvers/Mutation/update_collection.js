import { canUserUpdateCollection } from "../../../lib/acl/collection";
import { updateCollectionById } from "../../../db/collections";

export default async (root, args, context, info) => {
  try {
    if (!context.warden.isAuthenticated()) {
      return {
        success: false,
        message: 'Not authenticated!'
      }
    }

    let isAble = await canUserUpdateCollection(context.warden.user.id, args)
    if (isAble !== true) {
      return {
        success: false,
        message: isAble
      }
    }

    let fieldsToUpdate = {}

    for (const key of Object.keys(args)) {
      if (key === 'id') continue;

      if (args[key] != null) {
        fieldsToUpdate[key] = args[key]
      }
    }

    let collection = await updateCollectionById(args.id, fieldsToUpdate, [
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
      message: 'Unable to update collection.'
    }
  } catch (err) {
    console.log('Mutation.update_collection error: ', err)
    return {
      success: false,
      message: 'An unexpected error occurred.'
    }
  }
}