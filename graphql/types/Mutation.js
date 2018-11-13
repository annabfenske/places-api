import { GraphQLObjectType } from 'graphql'
import mutations from '../mutations'

export default new GraphQLObjectType({
  description: 'Root mutation object',
  name: 'Mutation',
  fields: mutations
})
