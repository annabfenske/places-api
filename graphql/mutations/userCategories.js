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
      icon: {
        type: new GraphQLNonNull(GraphQLString)
      },
      color: {
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
    type: UserCategory,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString)
      },
      name: {
        type: GraphQLString
      },
      icon: {
        type: GraphQLString
      }
    },
    where: (categoryTable, args) => {
      return escape(`${categoryTable}.id = %L`, args.id)
    },
    resolve: async (warden, args, context, info) => {
      try {

        let updateFields = {}

        if (args.name) {
          updateFields.name = args.name
        }

        if (args.icon) {
          updateFields.icon = args.icon
        }

        await updateCategoryById(args.id, updateFields, 'id')

        return joinMonster(info, warden, sql => knex.raw(sql))
      } catch (err) {
        console.log('edit_category err:', err)
        return err
      }
    }
  }
}
