import {
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList
} from 'graphql'
import fetch from 'node-fetch'
import qs from 'qs'

import Place from '../types/Place'
import { BoundingBoxInput, PointInput } from '../inputTypes'

import { isValidLocation } from '../../lib/validation'
import { MAPBOX_TYPES } from '../../lib/constants'

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
      types: {
        type: new GraphQLList(GraphQLString)
      },
      autocomplete: {
        type: GraphQLBoolean
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
          types,
          autocomplete,
          limit
        } = args

        if (!isValidLocation(args.location)) {
          return new Error('Invalid location')
        }

        let queryVals = {
          access_token: process.env.MAPBOX_KEY,
          fuzzyMatch: false,
          proximity: `${location.lng},${location.lat}`
        }

        if (types != null) {
          types = types.map(t => t.toLowerCase())
          if (
            types.some(type => MAPBOX_TYPES.indexOf(type) === -1)
          ) {
            return new Error('Invalid types')
          }

          queryVals.types = types.join(',')
        } else {
          queryVals.types = 'poi'
        }

        if (autocomplete != null) {
          queryVals.autocomplete = autocomplete
        }

        if (
          limit != null &&
          limit <= 10 &&
          limit > 0
        ) {
          queryVals.limit = limit
        } else {
          queryVals.limit = 10
        }

        let query = qs.stringify(queryVals)

        // TODO: clean keyword

        let result = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(keyword)}.json?${query}`
        ).then(res => res.json())

        if (!result.features) {
          return new Error(result.message || 'Not Found')
        }

        return result.features

      } catch (err) {
        console.log('search_places error: ', err)
        return err
      }
    }
  }
}
