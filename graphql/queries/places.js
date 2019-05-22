import {
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList
} from 'graphql'
import Place, { YelpSearchResponse } from '../types/Place'
import { PointInput } from '../inputTypes'

import { FOURSQUARE_CATEGORIES, foursquareFetch } from '../../lib/foursquare'
import { yelpFetch } from '../../lib/yelp'
import { isValidLocation } from '../../lib/validation'

export default {
  places: {
    type: YelpSearchResponse,
    description: 'Search for places with Yelp',
    args: {
      location: {
        type: new GraphQLNonNull(PointInput)
      },
      keyword: {
        type: new GraphQLNonNull(GraphQLString)
      },
      limit: {
        type: GraphQLInt
      },
      offset: {
        type: GraphQLInt
      },
      price: {
        type: new GraphQLList(GraphQLInt)
      },
      open_now: {
        type: GraphQLBoolean
      },
      open_at: {
        type: GraphQLInt
      }
    },
    resolve: async (warden, args, context, info) => {
      try {
        if (!isValidLocation(args.location)) {
          return new Error('Invalid location')
        }

        if (args.limit && args.limit > 1000 || args.limit < 0) {
          return new Error('Invalid limit')
        }

        if (!warden.isAuthenticated()) {
          return {
            total: 0,
            businesses: [],
            regionCenter: args.location
          }
        }

        let categories = ['bars', 'restaurants']

        let query = {
          latitude: args.location.lat,
          longitude: args.location.lng,
          categories: categories.join(','),
          term: args.keyword
        }

        if (args.limit && args.limit <= 1000 && args.limit > 0) {
          query.limit = args.limit
        }

        if (args.offset && args.offset > 0) {
          query.offset = args.offset
        }

        if (args.price) {
          query.price = args.price.join(',')
        }

        if (args.open_now != null) {
          query.open_now = args.open_now
        } else if (args.open_at != null) {
          query.open_at = args.open_at
        }



        return []
      } catch (err) {
        console.log(err)
        return err
      }
    }
  },
  places_foursquare: {
    type: new GraphQLList(Place),
    description: 'Search for places in Foursquare',
    args: {
      location: {
        type: new GraphQLNonNull(PointInput)
      },
      keyword: {
        type: new GraphQLNonNull(GraphQLString)
      },
      limit: {
        type: GraphQLInt
      }
    },
    resolve: async (warden, args, context, info) => {
      try {
        if (!warden.isAuthenticated()) {
          return []
        }

        let {
          location,
          keyword,
          limit
        } = args

        if (!isValidLocation(args.location)) {
          return new Error('Invalid location')
        }

        // TODO: pass in as args?
        let categories = [
          FOURSQUARE_CATEGORIES.NIGHTLIFE,
          FOURSQUARE_CATEGORIES.FOOD
        ]

        let query = {
          intent: 'browse',
          ll: `${location.lat},${location.lng}`,
          radius: 7000,
          categoryId: categories.join(','),
          query: keyword
        }

        if (
          limit != null &&
          limit <= 50 &&
          limit > 0
        ) {
          query.limit = limit
        } else {
          query.limit = 10
        }

        let response = await foursquareFetch('/venues/search', { query })
        return response.venues || []

      } catch (err) {
        console.log('places error: ', err)
        return err
      }
    }
  },
  place: {
    type: Place,
    description: 'Fetch a place from Foursquare by id',
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async (warden, args, context, info) => {
      try {
        if (!warden.isAuthenticated()) {
          return null
        }

        let response = await foursquareFetch(`/venues/${args.id}`)
        return response.venue
      } catch (err) {
        console.log('place error: ', err)
        return err
      }
    }
  }
}
