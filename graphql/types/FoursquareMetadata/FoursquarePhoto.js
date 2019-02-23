import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull
} from 'graphql'

import moment from 'moment'

export default new GraphQLObjectType({
  name: 'FoursquarePhoto',
  description: 'A photo from Foursquare for a specific place',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    createdAt: {
      type: GraphQLString,
      description: 'The timestamp at which the photo was added',
      resolve: (photo) => 
        photo.createdAt && 
        moment
          .unix(photo.createdAt)
          .utc()
          .format()
    },
    url: {
      type: GraphQLString,
      description: 'The URL of the photo',
      resolve: (photo) => {
        if (!photo.prefix || !photo.suffix) {
          return null
        }

        return `${photo.prefix}${photo.width}x${photo.height}${photo.suffix}`
      }
    },
    prefix: {
      type: GraphQLString,
      description: 'URL prefix for this photo'
    },
    suffix: {
      type: GraphQLString,
      description: 'URL suffix for this photo'
    },
    width: {
      type: GraphQLInt,
      description: 'Width of the photo'
    },
    height: {
      type: GraphQLInt,
      description: 'Height of the photo'
    }
  })
})
