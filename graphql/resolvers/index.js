import Query from './Query'
import Mutation from './Mutation'
import { linked_Collection } from './Collection'

export default {
  Query,
  Mutation
}

export const linkResolvers = (yelpSchema, transforms) => ({
  Collection: linked_Collection(yelpSchema, transforms)
})