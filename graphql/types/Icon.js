import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} from 'graphql'

export default new GraphQLObjectType({
  description: 'An icon',
  name: 'Icon',
  sqlTable: 'icons',
  uniqueKey: 'id',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    name: {
      description: 'The name of the icon',
      type: new GraphQLNonNull(GraphQLString)
    },
    type: {
      description: 'The type of icon (material, material community, entypo, etc.)',
      type: new GraphQLNonNull(GraphQLString)
    }
  })
})
