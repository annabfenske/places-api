import {
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList
} from 'graphql'
import fetch from 'node-fetch'
import qs from 'qs'

import Place from '../types/Place'
import { PointInput } from '../inputTypes'

import { isValidLocation } from '../../lib/validation'

export default {
  places: {
    type: new GraphQLList(Place),
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

        let queryVals = {
          client_id: process.env.FOURSQUARE_CLIENT_ID,
          client_secret: process.env.FOURSQUARE_CLIENT_SECRET,
          v: process.env.FOURSQUARE_API_VERSION,
          intent: 'browse',
          ll: `${location.lat},${location.lng}`,
          radius: 7000,
          categoryId: '4d4b7105d754a06376d81259,4d4b7105d754a06374d81259',  // TODO: pass in as args?
          query: keyword
        }

        if (
          limit != null &&
          limit <= 50 &&
          limit > 0
        ) {
          queryVals.limit = limit
        } else {
          queryVals.limit = 10
        }

        let query = qs.stringify(queryVals)

        let result = await fetch(
          `${process.env.FOURSQUARE_API_URL}/venues/search?${query}`
        ).then(res => res.json())

        if (result.meta.code !== 200)  {
          console.log('ERROR: ', result)
          return new Error(result.meta.errorType)
        }

        return result.response.venues || []

      } catch (err) {
        console.log('search_places error: ', err)
        return err
      }
    }
  }
}
