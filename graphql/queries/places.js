import {
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList
} from 'graphql'
import Place from '../types/Place'
import { PointInput } from '../inputTypes'

import { FOURSQUARE_CATEGORIES, foursquareFetch } from '../../lib/foursquare'
import { isValidLocation } from '../../lib/validation'

export default {
  places: {
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
