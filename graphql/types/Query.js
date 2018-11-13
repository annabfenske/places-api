import { GraphQLObjectType } from 'graphql'
import queries from '../queries'

export default new GraphQLObjectType({
  description: 'Root query object',
  name: 'Query',
  fields: () => queries
})
