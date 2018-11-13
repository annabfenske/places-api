import { GraphQLSchema } from 'graphql'
import Query from './types/Query'
import Mutation from './types/Mutation'

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation
})
