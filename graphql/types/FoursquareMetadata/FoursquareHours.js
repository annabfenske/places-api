import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'

export const OpenHours = new GraphQLObjectType({
  name: 'OpenHours',
  description: 'The hours that a venue is open during a timeframe',
  fields: () => ({
    start: {
      description: 'The time as HHMM (24hr) at which the segment begins',
      type: new GraphQLNonNull(GraphQLString)
    },
    end: {
      description: 'The time as HHMM (24hr) at which the segment ends',
      type: new GraphQLNonNull(GraphQLString)
    },
    followingDay: {
      description: 'Whether or not the end time falls in the following day',
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ end }) => {
        return end.indexOf('+') === 0
      }
    }
  })
})

export const TimeFrame = new GraphQLObjectType({
  name: 'TimeFrame',
  description: 'A frame of time describing when a Foursquare venue is open',
  fields: () => ({
    days: {
      description: 'Array of days represented as integers',
      type: new GraphQLList(GraphQLInt)
    },
    includesToday: {
      description: 'Indicates if this timeframe includes today',
      type: GraphQLBoolean
    },
    open: {
      description: 'An array describing the hours in the timeframe in which the venue is open',
      type: new GraphQLList(OpenHours)
    }
  })
})

export default new GraphQLObjectType({
  name: 'FoursquareHours',
  description: 'Hours for a venue',
  fields: () => ({
    hours: {
      type: new GraphQLList(TimeFrame),
      description: 'List of timeframes describing when the venue is open',
      resolve: (rootResponse) => rootResponse.hours && rootResponse.hours.timeframes
    },
    popular: {
      type: new GraphQLList(TimeFrame),
      description: 'List of timeframes describing when the venue is popular',
      resolve: (rootResponse) => rootResponse.popular && rootResponse.popular.timeframes
    }
  })
})