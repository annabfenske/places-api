import { getCollectionByName, getCollectionById } from '../../db/collections'
import { getIconById, getColorById } from '../../db/utils'
import { getBusinessById, isBusinessAdded } from '../../db/businesses';

export const canUserCreateCollection = async (user_id, args) => {
  if (args.name.trim() === '') {
    return `Invalid collection name.`
  }

  let existingCollection = await getCollectionByName(args.name, user_id, 'id')
  if (existingCollection && existingCollection.id) {
    return `Collection "${args.name}" already exists.`
  }

  let icon = await getIconById(args.icon_id, 'id')
  if (!icon || !icon.id) {
    return `Invalid icon.`
  }

  let color = await getColorById(args.color_id, 'id')
  if (!color || !color.id) {
    return `Invalid color.`
  }

  return true
}

export const doesUserOwnCollection = async (user_id, collection_id) => {
  let collection = await getCollectionById(collection_id, 'user_id')
  if (collection && collection.user_id === user_id) {
    return true
  }

  return false
}

export const canUserUpdateCollection = async (user_id, args) => {
  let isAuthorized = await doesUserOwnCollection(user_id, args.id)
  if (!isAuthorized) {
    return `Collection not found!`
  }

  if (args.name != null) {
    if (args.name.trim() === '') {
      return `Invalid collection name.`
    }

    let existingCollection = await getCollectionByName(args.name, user_id, 'id')
    if (existingCollection && existingCollection.id && existingCollection.id !== args.id) {
      return `Collection "${args.name}" already exists.`
    }
  }

  if (args.icon_id != null) {
    let icon = await getIconById(args.icon_id, 'id')
    if (!icon || !icon.id) {
      return `Invalid icon.`
    }
  }

  if (args.color_id != null) {
    let color = await getColorById(args.color_id, 'id')
    if (!color || !color.id) {
      return `Invalid color.`
    }
  }

  return true
}

export const canUserAddToCollection = async (user_id, args) => {
  let isAuthorized = await doesUserOwnCollection(user_id, args.collection_id)
  if (!isAuthorized) {
    return `Collection not found!`
  }

  let business = await getBusinessById(args.business_id, 'id')
  if (!business || !business.id) {
    return `Location not found!`
  }

  let isInCollection = await isBusinessAdded(user_id, args.business_id, args.collection_id)
  if (isInCollection) {
    return `This location has already been saved to this collection.`
  }

  return true
}