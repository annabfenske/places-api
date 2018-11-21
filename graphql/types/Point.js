import {
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLNonNull
} from 'graphql'

export default new GraphQLObjectType({
  description: 'A point (lat, lng) on the map',
  name: 'Point',
  fields: () => ({
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  })
})
