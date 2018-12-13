import joinMonster from 'join-monster'
import escape from 'pg-escape'
import knex from '../../connectors/postgres'

import {
  GraphQLString,
  GraphQLNonNull
} from 'graphql'
import Viewer from '../types/Viewer'
import { PointInput } from '../inputTypes'

import {
  createCategory,
  getCategoryById,
  getCategoryByName
} from '../../db/userCategories'
import { createPlace } from '../../db/userPlaces'

import { isValidLocation } from '../../lib/validation'

export default {
  create_place: {
    description: 'Create a new place with a category id',
    type: Viewer,
    args: {
      name: {
        type: new GraphQLNonNull(GraphQLString)
      },
      place_id: {
        type: new GraphQLNonNull(GraphQLString)
      },
      location: {
        type: new GraphQLNonNull(PointInput)
      },
      category_id: {
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

        if (!isValidLocation(args.location)) {
          return new Error('Invalid location')
        }

        let category = await getCategoryById(args.category_id, 'user_id')

        if (
          !category ||
          category.user_id !== warden.user.id
        ) {
          return new Error('Category not found')
        }

        let placeArgs = {
          name: args.name,
          place_id: args.place_id,
          latitude: args.location.lat,
          longitude: args.location.lng
        }

        await createPlace(placeArgs, args.category_id, 'id')

        return joinMonster(info, warden, sql => knex.raw(sql))

      } catch (err) {
        console.log('create_place err:', err)
        return err
      }
    }
  },
  create_category_and_place: {
    description: 'Create a new category and insert a place into that category',
    type: Viewer,
    args: {
      category_name: {
        type: new GraphQLNonNull(GraphQLString)
      },
      category_icon: {
        type: new GraphQLNonNull(GraphQLString)
      },
      category_color: {
        type: new GraphQLNonNull(GraphQLString)
      },
      place_name: {
        type: new GraphQLNonNull(GraphQLString)
      },
      place_id: {
        type: new GraphQLNonNull(GraphQLString)
      },
      location: {
        type: new GraphQLNonNull(PointInput)
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

        if (!isValidLocation(args.location)) {
          return new Error('Invalid location')
        }

        let categoryArgs = {
          name: args.category_name,
          icon: args.category_icon,
          color: args.category_color
        }

        let placeArgs = {
          name: args.place_name,
          place_id: args.place_id,
          longitude: args.location.lng,
          latitude: args.location.lat
        }

        let existingCategory = await getCategoryByName(
          args.category_name,
          warden.user.id,
          'id'
        )

        if (existingCategory) {
          throw new Error(`Category "${args.category_name}" already exists.`)
        }

        let newCategory = await createCategory(categoryArgs, warden.user.id, 'id')
        await createPlace(placeArgs, newCategory.id, 'id')

        return joinMonster(info, warden, sql => knex.raw(sql))

      } catch (err) {
        console.log('create_category_and_place err:', err)
        return err
      }
    }
  }
}
