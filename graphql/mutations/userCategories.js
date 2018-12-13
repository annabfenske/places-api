import joinMonster from 'join-monster'
import escape from 'pg-escape'
import knex from '../../connectors/postgres'

import {
  GraphQLString,
  GraphQLNonNull
} from 'graphql'
import Viewer from '../types/Viewer'
import UserCategory from '../types/UserCategory'

import {
  createCategory,
  getCategoryById,
  getCategoryByName,
  updateCategoryById
} from '../../db/userCategories'

export default {
  create_category: {
    description: 'Create a new category',
    type: Viewer,
    args: {
      name: {
        type: new GraphQLNonNull(GraphQLString)
      },
      icon_id: {
        type: new GraphQLNonNull(GraphQLString)
      },
      color_id: {
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    where: (usersTable, args, warden) => {
      return escape(`${usersTable}.id = %L`, warden.user.id)
    },
    resolve: async (warden, args, context, info) => {
      try {
        if (!warden.isAuthenticated()) {
          return new Error('Not Authenticated')
        }

        let existingCategory = await getCategoryByName(args.name, warden.user.id, 'id')

        if (existingCategory) {
          throw new Error(`Category "${args.name}" already exists.`)
        }

        await createCategory(args, warden.user.id, 'id')

        return joinMonster(info, warden, sql => knex.raw(sql))
      } catch (err) {
        console.log('create_category err:', err)
        return err
      }
    }
  },
  update_category: {
    description: 'Edit an existing category',
    type: Viewer,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString)
      },
      name: {
        type: GraphQLString
      },
      icon_id: {
        type: GraphQLString
      },
      color_id: {
        type: GraphQLString
      }
    },
    where: (usersTable, args, warden) => {
      return escape(`${usersTable}.id = %L`, warden.user.id)
    },
    resolve: async (warden, args, context, info) => {
      try {

        if (!warden.isAuthenticated()) {
          return new Error('Not Authenticated')
        }

        let category = await getCategoryById(args.id, 'user_id')

        if (!category) {
          return new Error('Category does not exist')
        }

        if (category.user_id !== warden.user.id) {
          return new Error('Not Authorized')
        }

        let updateFields = {}

        if (args.name) {
          updateFields.name = args.name
        }

        if (args.icon_id) {
          updateFields.icon_id = args.icon_id
        }

        if (args.color_id) {
          updateFields.color_id = args.color_id
        }

        await updateCategoryById(args.id, updateFields, 'id')

        return joinMonster(info, warden, sql => knex.raw(sql))
      } catch (err) {
        console.log('update_category err:', err)
        return err
      }
    }
  }
}
