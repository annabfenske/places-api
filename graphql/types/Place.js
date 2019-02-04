import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList
} from 'graphql'
import Point from './Point'
import FoursquareCategory from './FoursquareCategory'
import UserCategory from './UserCategory'

import { hasUserAddedPlace } from '../../db/userPlaces'
import { getCategoriesByPlaceId } from '../../db/userCategories'

export default new GraphQLObjectType({
  description: 'A place on the map (returned by MapBox request)',
  name: 'Place',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    name: {
      description: 'The name of the place',
      type: new GraphQLNonNull(GraphQLString)
    },
    categories: {
      description: 'The categories associated with a place',
      type: new GraphQLList(FoursquareCategory)
    },
    address: {
      description: 'The street address for this place',
      type: GraphQLString,
      resolve: place => place.location.address
    },
    city: {
      description: 'The city this place exists in',
      type: GraphQLString,
      resolve: place => place.location.city
    },
    state: {
      description: 'The state this place exists in',
      type: GraphQLString,
      resolve: place => place.location.state
    },
    zip: {
      description: 'The postal code this place exists in',
      type: GraphQLString,
      resolve: place => place.location.postalCode
    },
    cc: {
      description: 'The country code for the country this place exists in',
      type: GraphQLString,
      resolve: place => place.location.cc
    },
    country: {
      description: 'The country this place exists in',
      type: GraphQLString,
      resolve: place => place.location.country
    },
    formattedAddress: {
      description: 'The formatted address for this place',
      type: new GraphQLList(GraphQLString),
      resolve: place => place.location.formattedAddress
    },
    location: {
      description: 'The lat,lng coordinates for this place',
      type: new GraphQLNonNull(Point),
      resolve: (place) => ({
        lng: place.location.lat,
        lat: place.location.lng
      })
    },
    added: {
      description: 'Whether or not the viewer has added this place already',
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (place, args, { warden, ...context }, info) => {
        if (!warden.isAuthenticated()) {
          return false
        }

        return hasUserAddedPlace(warden.user.id, place.id)
      }
    },
    userCategories: {
      description: 'The category/categories the viewer has added this place to',
      type: new GraphQLList(UserCategory),
      args: {
        limit: {
          type: GraphQLInt
        },
        offset: {
          type: GraphQLInt
        }
      },
      resolve: (place, args, { warden, ...context }, info) => {
        if (!warden.isAuthenticated()) {
          return null
        }

        return getCategoriesByPlaceId(warden.user.id, place.id, args)
      }
    }
  })
})
