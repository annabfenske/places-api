import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString
} from 'graphql'

export default new GraphQLObjectType({
  description: 'A description of a venue\'s price tier',
  name: 'FoursquarePrice',
  fields: _ => ({
    tier: {
      type: GraphQLInt
    },
    message: {
      type: GraphQLString
    },
    currency: {
      type: GraphQLString
    }
  })
})