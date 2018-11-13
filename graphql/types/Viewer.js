import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} from 'graphql'

export default new GraphQLObjectType({
  description: 'The authenticated Places user making each request',
  name: 'Viewer',
  sqlTable: 'users',
  uniqueKey: 'id',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    first_name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    last_name: {
      type: new GraphQLNonNull(GraphQLString)
    }
  })
})
