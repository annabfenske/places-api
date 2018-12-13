import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} from 'graphql'

export default new GraphQLObjectType({
  description: 'A color',
  name: 'Color',
  sqlTable: 'colors',
  uniqueKey: 'id',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    name: {
      description: 'The name of the color',
      type: new GraphQLNonNull(GraphQLString)
    },
    hex: {
      description: 'The hex code of the color',
      type: new GraphQLNonNull(GraphQLString)
    }
  })
})
