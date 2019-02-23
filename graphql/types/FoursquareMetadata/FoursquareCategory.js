import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull
} from 'graphql'

export default new GraphQLObjectType({
  description: 'A venue category as provided by Foursquare',
  name: 'FoursquareCategory',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    pluralName: {
      type: new GraphQLNonNull(GraphQLString)
    },
    shortName: {
      type: new GraphQLNonNull(GraphQLString)
    },
    icon: {
      type: GraphQLString,
      resolve: category => category.icon.prefix + category.icon.suffix
    },
    primary: {
      type: GraphQLBoolean
    }
  })
})