import {
  GraphQLInputObjectType,
  GraphQLFloat,
  GraphQLNonNull
} from 'graphql'

export default new GraphQLInputObjectType({
  description: 'A point (lat, lng) on the map',
  name: 'PointInput',
  fields: () => ({
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  })
})
