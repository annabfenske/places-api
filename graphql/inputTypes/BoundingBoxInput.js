import {
  GraphQLInputObjectType,
  GraphQLFloat,
  GraphQLNonNull
} from 'graphql'

export default new GraphQLInputObjectType({
  description: 'A bounding box',
  name: 'BoundingBoxInput',
  fields: () => ({
    minLat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    maxLat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    minLng: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    maxLng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  })
})
