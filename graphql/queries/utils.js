import joinMonster from 'join-monster'
import escape from 'pg-escape'
import knex from '../../connectors/postgres'

import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLList
} from 'graphql'

import Icon from '../types/Icon'
import Color from '../types/Color'

export default {
  icons: {
    type: new GraphQLList(Icon),
    resolve: (warden, args, context, info) => {
      return joinMonster(info, warden, sql => knex.raw(sql))
    }
  },
  icon: {
    type: Icon,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    where: (iconTable, args, warden) => {
      return escape(`${iconTable}.id = %L`, args.id)
    },
    resolve: (warden, args, context, info) => {
      return joinMonster(info, warden, sql => knex.raw(sql))
    }
  },
  colors: {
    type: new GraphQLList(Color),
    resolve: (warden, args, context, info) => {
      return joinMonster(info, warden, sql => knex.raw(sql))
    }
  },
  color: {
    type: Color,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    where: (colorTable, args, warden) => {
      return escape(`${colorTable}.id = %L`, args.id)
    },
    resolve: (warden, args, context, info) => {
      return joinMonster(info, warden, sql => knex.raw(sql))
    }
  }
}
