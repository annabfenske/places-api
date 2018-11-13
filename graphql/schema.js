import { GraphQLSchema } from 'graphql'
import { Query, Mutation } from './types'

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation
})
