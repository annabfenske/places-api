import { getIconById } from "../../../db/utils"
import { getCollectionById } from "../../../db/collections"

export default async (parent, args, context, info) => {
  try {
    if (parent.icon) return parent.icon

    if (parent.icon_id) {
      return getIconById(parent.icon_id)
    }

    let collection = await getCollectionById(parent.id, 'icon_id')
    if (collection) {
      return getIconById(collection.icon_id)
    }

    return null
  } catch (err) {
    console.log('Collection.icon error: ', err)
    return null
  }
}