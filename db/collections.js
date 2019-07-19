import knex from '../connectors/postgres'
import escape from 'pg-escape'

export const createCollection = (fields, returning = '*') => {
  return knex('collections')
    .insert(fields)
    .returning(returning)
    .then(rows => rows[0])
}

export const getCollectionById = (id, fields = '*') => {
  return knex('collections')
    .where('id', id)
    .first(fields)
}

export const getCollectionByName = (name, user_id, fields = '*') => {
  return knex('collections')
    .where('user_id', user_id)
    .whereRaw(
      escape('UPPER(name) = UPPER(%L)', name)
    )
    .first(fields)
}

export const updateCollectionById = (id, fields, returning = '*') => {
  return knex('collections')
    .where('id', id)
    .update({
      ...fields,
      updated_at: knex.fn.now()
    })
    .returning(returning)
    .then(rows => rows[0])
}

const formatCollection = (collection) => ({
  id: collection.id,
  name: collection.name,
  icon: {
    id: collection.icon_id,
    name: collection.icon_name,
    type: collection.icon_type
  },
  color: {
    id: collection.color_id,
    name: collection.color_name,
    hex: collection.color_hex
  }
})

export const getCollections = (user_id, args = {}) => {
  let query = knex('collections')
    .join('icons', 'icons.id', 'collections.icon_id')
    .join('colors', 'colors.id', 'collections.color_id')
    .where('collections.user_id', user_id)
    .select([
      'collections.id', 
      'collections.name',
      'collections.icon_id',
      'collections.color_id',
      knex.raw(`jsonb_build_object(
        'id', icons.id,
        'name', icons.name,
        'type', icons.type
      ) AS icon`),
      knex.raw(`jsonb_build_object(
        'id', colors.id,
        'name', colors.name,
        'hex', colors.hex
      ) AS color`)
    ])
    .groupBy('collections.id', 'icons.id', 'colors.id')
  

  if (args.business_id != null) {
    query
      .join('business_collections', 'business_collections.collection_id', 'collections.id')
      .where('business_collections.business_id', args.business_id)
  }

  if (args.limit && args.limit > 0) {
    query.limit(args.limit)
  }

  if (args.offset && args.offset > 0) {
    query.offset(args.offset)
  }

  return query.orderBy('collections.name', 'ASC')
}

export const getCollectionsForUser = (user_id, args = {}) => {
  let query = knex('collections')
    .join('icons', 'icons.id', 'collections.icon_id')
    .join('colors', 'colors.id', 'collections.color_id')
    .where('collections.user_id', user_id)
    .select(
      'collections.id',
      'collections.name',

    )
}