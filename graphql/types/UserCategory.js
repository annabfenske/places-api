import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList
} from 'graphql'
import escape from 'pg-escape'

import UserPlace from './UserPlace'
import Icon from './Icon'
import Color from './Color'

export default new GraphQLObjectType({
  description: 'A category of places saved by a user',
  name: 'UserCategory',
  sqlTable: 'user_categories',
  uniqueKey: 'id',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    name: {
      description: 'The name of this category',
      type: new GraphQLNonNull(GraphQLString)
    },
    icon: {
      description: 'The icon to display for this category',
      type: new GraphQLNonNull(Icon),
      sqlJoin: (categoryTable, iconTable) =>
        escape(`${categoryTable}.icon_id = ${iconTable}.id`)
    },
    color: {
      description: 'The hex code for the color to display for this category',
      type: new GraphQLNonNull(Color),
      sqlJoin: (categoryTable, colorTable) =>
        escape(`${categoryTable}.color_id = ${colorTable}.id`)
    },
    places: {
      description: 'The places in this category',
      type: new GraphQLList(UserPlace),
      sqlJoin: (categoryTable, placeTable) =>
        escape(`${categoryTable}.id = ${placeTable}.category_id`)
    }
  })
})
