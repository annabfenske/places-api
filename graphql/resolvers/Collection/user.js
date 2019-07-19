import { getUserByCollectionId } from "../../../db/users";

export default (parent, args, context, info) => {
  // TODO: return only fields in info.selectionSet
  return getUserByCollectionId(parent.id)
    .catch(err => {
      console.log(`Collection[id="${parent.id}"].user error: `, err)
      return null
    })
}