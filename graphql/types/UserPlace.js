import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLList
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
      description: 'The Mapbox place id',
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
