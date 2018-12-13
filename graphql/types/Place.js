import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList
} from 'graphql'
import Point from './Point'

import { hasUserAddedPlace } from '../../db/userPlaces'

export default new GraphQLObjectType({
  description: 'A place on the map (returned by MapBox request)',
  name: 'Place_Mapbox',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    type: {
      type: new GraphQLNonNull(GraphQLString)
    },
    relevance: {
      description: 'The relevance of the place to the query that was submitted',
      type: GraphQLFloat
    },
    name: {
      description: 'The name of the place',
      type: new GraphQLNonNull(GraphQLString),
      resolve: (place) => place.text
    },
    phone: {
      description: 'The phone number associated with this place',
      type: GraphQLString,
      resolve: (place) => place.properties && place.properties.tel
    },
    categories: {
      description: 'The categories associated with a place',
      type: new GraphQLList(GraphQLString),
      resolve: (place) => {
        if (
          place.properties &&
          place.properties.category
        ) {
          return place.properties.category
            .split(',')
            .map(cat => cat.trim())
        }

        return []
      }
    },
    address: {
      description: 'The street address for this place',
      type: GraphQLString,
      resolve: (place) => {
        if (place.place_type.indexOf('poi') > -1) {
          return place.properties.address
        }

        return place.address
      }
    },
    city: {
      description: 'The city this place exists in',
      type: GraphQLString,
      resolve: (place) => {
        let city = place.context.find(item => item.id.match(/place/))
        return city && city.text
      }
    },
    state: {
      description: 'The state this place exists in',
      type: GraphQLString,
      resolve: (place) => {
        let state = place.context.find(item => item.id.match(/region/))
        return state && state.text
      }
    },
    zip: {
      description: 'The postal code this place exists in',
      type: GraphQLString,
      resolve: (place) => {
        let zip = place.context.find(item => item.id.match(/postcode/))
        return zip && zip.text
      }
    },
    location: {
      description: 'The lat,lng coordinates for this place',
      type: new GraphQLNonNull(Point),
      resolve: (place) => ({
        lng: place.center[0],
        lat: place.center[1]
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
    }
  })
})
