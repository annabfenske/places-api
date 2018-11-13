import {
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'
import Viewer from './Viewer'

export default new GraphQLObjectType({
  name: 'AuthResponse',
  fields: {
    success: {
      type: new GraphQLNonNull(GraphQLBoolean)
    },
    message: {
      type: new GraphQLNonNull(GraphQLString)
    },
    viewer: { type: Viewer },
    token: { type: GraphQLString }
  }
})
