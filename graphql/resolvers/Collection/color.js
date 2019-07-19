import { getColorById } from "../../../db/utils"
import { getCollectionById } from "../../../db/collections"

export default async (parent, args, context, info) => {
  try {
    if (parent.color) return parent.color

    if (parent.color_id) {
      return getColorById(parent.color_id)
    }

    let collection = await getCollectionById(parent.id, 'color_id')
    if (collection) {
      return getColorById(collection.color_id)
    }

    return null
  } catch (err) {
    console.log('Collection.color error: ', err)
    return null
  }
}