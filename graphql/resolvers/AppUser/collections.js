import { getCollections } from "../../../db/collections"

export default async (parent, args, context, info) => {
  try {
    return getCollections(parent.id, args)
  } catch (err) {
    console.log(`AppUser[id=${parent.id}].collections error: `, err)
    return []
  }
}