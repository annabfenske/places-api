import {
  GraphQLString,
  GraphQLObjectType
} from 'graphql'

export default new GraphQLObjectType({
  name: 'FoursquareContact',
  description: 'Contact information for a foursquare venue',
  fields: () => ({
    twitter: {
      type: GraphQLString
    },
    phone: {
      type: GraphQLString
    },
    formattedPhone: {
      type: GraphQLString
    },
    facebook: {
      type: GraphQLString
    },
    facebookUsername: {
      type: GraphQLString
    },
    facebookName: {
      type: GraphQLString
    },
    instagram: {
      type: GraphQLString
    }
  })
})