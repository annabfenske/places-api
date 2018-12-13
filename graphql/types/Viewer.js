import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList
} from 'graphql'
import escape from 'pg-escape'

import UserCategory from './UserCategory'

export default new GraphQLObjectType({
  description: 'The authenticated Places user making each request',
  name: 'Viewer',
  sqlTable: 'users',
  uniqueKey: 'id',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    first_name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    last_name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    categories: {
      type: new GraphQLList(UserCategory),
      args: {
        id: {
          type: GraphQLString
        }
      },
      // TODO: test this
      where: (categoryTable, args) => {
        if (args.id) {
          return escape(`${categoryType}.id = %L`, args.id)
        }
        return 'true'
      },
      sqlJoin: (userTable, categoryTable) =>
        escape(`${userTable}.id = ${categoryTable}.user_id`)
    }
  })
})
