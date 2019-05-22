import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList
} from 'graphql'

import moment from 'moment'

export default new GraphQLObjectType({
  name: 'YelpHours',
  description: 'The hours at which a business from Yelp Fusion API is open',
  fields: _ => ({
    open: {
      description: 'List of days & hours at which the business is open',
      type: new GraphQLList(YelpOpenHours)
    },
    hours_type: {
      description: 'Description of the "open" attribute',
      type: GraphQLString
    },
    is_open_now: {
      description: 'Whether or not the business is open now',
      type: GraphQLBoolean
    }
  })
})

export const YelpOpenHours = new GraphQLObjectType({
  name: 'YelpOpenHours',
  description: 'Represents a period of time at which a business is open',
  fields: _ => ({
    is_overnight: {
      type: GraphQLBoolean
    },
    start: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        format: {
          type: GraphQLString
        }
      },
      resolve: (root, args) => {
        if (args.format) {
          return moment(root.start, 'HHmm').format(args.format)
        }
        return root.start
      }
    },
    end: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        format: {
          type: GraphQLString
        }
      },
      resolve: (root, args) => {
        if (args.format) {
          return moment(root.end, 'HHmm').format(args.format)
        }
        return root.end
      }
    },
    day: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  })
})