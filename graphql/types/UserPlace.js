import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLNonNull
} from 'graphql'

export default new GraphQLObjectType({
  description: 'A category of places saved by a user',
  name: 'UserPlace',
  sqlTable: 'user_places',
  uniqueKey: 'id',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    place_id: {
      description: 'The Foursquare venue id',
      type: new GraphQLNonNull(GraphQLString)
    },
    name: {
      description: 'The name of this place',
      type: new GraphQLNonNull(GraphQLString)
    },
    latitude: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    longitude: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  })
})
