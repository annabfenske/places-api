import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList
} from 'graphql'
import Point from './Point'
import {
  FoursquareCategory,
  FoursquareContact,
  FoursquareHours,
  FoursquarePhoto,
  FoursquarePrice
} from './FoursquareMetadata'
import { YelpHours, YelpCategory } from './Yelp'
import UserCategory from './UserCategory'

import { hasUserAddedPlace } from '../../db/userPlaces'
import { getCategoriesByPlaceId } from '../../db/userCategories'

import { foursquareFetch } from '../../lib/foursquare'

export default new GraphQLObjectType({
  description: 'A place on the map (returned by Foursquare request)',
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
    timeZone: {
      description: 'The time zone in which this place exists',
      type: GraphQLString
    },
    location: {
      description: 'The lat,lng coordinates for this place',
      type: new GraphQLNonNull(Point),
      resolve: (place) => ({
        lng: place.location.lng,
        lat: place.location.lat
      })
    },
    url: {
      description: 'URL of the place\'s website',
      type: GraphQLString
    },
    description: {
      description: 'The description of the venue provided by the venue owner',
      type: GraphQLString
    },
    verified: {
      description: 'Whether or not the owner of the business has verified the business on foursquare',
      type: GraphQLBoolean
    },
    contact: {
      description: 'Contact info of the place',
      type: FoursquareContact
    },
    price: {
      description: 'Price tier for this place',
      type: FoursquarePrice
    },
    openHours: {
      description: 'The hours the place is open',
      type: FoursquareHours,
      resolve: async (place) => {
        try {
          let response = await foursquareFetch(`/venues/${place.id}/hours`)
          return response
        } catch (err) {
          return null
        }
      }
    },
    foursquarePhotos: {
      description: 'The photos added on Foursquare for this place',
      type: new GraphQLObjectType({
        name: 'Place_foursquarePhotos',
        fields: {
          count: {
            type: GraphQLInt
          },
          items: {
            type: new GraphQLList(FoursquarePhoto)
          }
        }
      }),
      resolve: (place) => {
        if (!place.photos || !place.photos.groups.some(({ type }) => type === 'venue')) {
          return {
            count: 0,
            items: []
          }
        }

        return place.photos.groups.find(({ type }) => type === 'venue')
      }
    },
    bestFoursquarePhoto: {
      description: 'The best photo as specified by Foursquare',
      type: FoursquarePhoto,
      resolve: (place) => place.bestPhoto
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

export const YelpPlace = new GraphQLObjectType({
  name: 'YelpPlace',
  description: 'A business returned by Yelp Fusion API',
  fields: _ => ({
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    price: {
      type: GraphQLString
    },
    url: {
      type: GraphQLString
    },
    phone: {
      type: GraphQLString
    },
    display_phone: {
      type: GraphQLString
    },
    display_address: {
      description: 'The formatted address for this place',
      type: new GraphQLList(GraphQLString),
      resolve: place => place.location.display_address
    },
    is_claimed: {
      type: GraphQLBoolean
    },
    rating: {
      type: GraphQLFloat
    },
    image_url: {
      type: GraphQLString
    },
    photos: {
      type: new GraphQLList(GraphQLString)
    },
    categories: {
      type: new GraphQLList(YelpCategory)
    },
    location: {
      type: new GraphQLNonNull(Point),
      resolve: place => ({
        lat: place.coordinates.latitude,
        lng: place.coordinates.longitude
      })
    },
    hours: {
      type: new GraphQLList(YelpHours)
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

export const YelpSearchResponse = new GraphQLObjectType({
  name: 'YelpSearchResponse',
  fields: _ => ({
    total: {
      type: GraphQLInt
    },
    businesses: {
      type: new GraphQLList(YelpPlace)
    },
    regionCenter: {
      type: Point,
      resolve: (response) => {
        if (response.regionCenter) {
          return response.regionCenter
        }
        return {
          lat: response.region.center.latitude,
          lng: response.region.center.longitude
        }
      }
    }
  })
})