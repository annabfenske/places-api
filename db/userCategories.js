import knex from '../connectors/postgres'
import escape from 'pg-escape'

export const createCategory = (fields, user_id, returning = '*') => {
  return knex('user_categories')
    .insert({ ...fields, user_id })
    .returning(returning)
    .then(rows => rows[0])
}

export const getCategoryById = (id, fields = '*') => {
  return knex('user_categories')
    .where('id', id)
    .select(fields)
    .then(rows => rows[0])
}

export const getCategoryByName = (name, user_id, fields = '*') => {
  return knex('user_categories')
    .where('user_id', user_id)
    .whereRaw(
      escape('UPPER(name) = UPPER(%L)', name)
    )
    .select(fields)
    .then(rows => rows[0])
}

export const updateCategoryById = (id, fields, returning = '*') => {
  return knex('user_categories')
    .where('id', id)
    .update({
      ...fields,
      updated_at: knex.fn.now()
    })
    .returning(returning)
    .then(rows => rows[0])
}

const formatCategory = (category) => ({
  id: category.id,
  name: category.name,
  icon: {
    id: category.icon_id,
    name: category.icon_name,
    type: category.icon_type
  },
  color: {
    id: category.color_id,
    name: category.color_name,
    hex: category.color_hex
  }
})

export const getCategoriesByPlaceId = (user_id, place_id, args = {}) => {
  let query = knex('user_categories')
    .join('user_places', 'user_places.category_id', 'user_categories.id')
    .join('icons', 'icons.id', 'user_categories.icon_id')
    .join('colors', 'colors.id', 'user_categories.color_id')
    .where('user_categories.user_id', user_id)
    .where('user_places.place_id', place_id)
    .select(
      'user_categories.id', 
      'user_categories.name',
      'user_categories.icon_id',
      'user_categories.color_id',
      'icons.name AS icon_name',
      'icons.type AS icon_type',
      'colors.hex AS color_hex',
      'colors.name AS color_name'
    )
    .groupBy('user_categories.id', 'icons.id', 'colors.id')
  
  if (args.limit && args.limit > 0) {
    query.limit(args.limit)
  }

  if (args.offset && args.offset > 0) {
    query.offset(args.offset)
  }

  return query
    .orderBy('user_categories.name', 'ASC')
    .then(rows => rows.map(formatCategory))
}
