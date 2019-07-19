import { saveBusiness } from '../../../db/businesses'

export default async (parent, args, context, info) => {
  try {
    await saveBusiness(parent)
    return true
  } catch (err) {
    console.log('Error saving business details to the db: ', err)
    return false
  }
}