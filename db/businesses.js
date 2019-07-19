import knex from '../connectors/postgres'
import escape from 'pg-escape'

export const getBusinessById = (id, fields = '*') => {
  return knex('businesses')
    .where('id', id)
    .first(fields)
}

const formatValueForColumn = (key, object) => {
  switch (key) {
    case 'id':
    case 'name':
    case 'alias':
    case 'url':
    case 'phone':
    case 'display_phone':
    case 'price':
      return escape('%L::varchar', object[key])
    case 'categories':
    case 'hours':
    case 'special_hours':
      if (!object[key]) return 'null'
      return escape(
        `ARRAY[${object[key].map(() => '%L').join(',')}]::jsonb[]`,
        ...object[key].map(JSON.stringify)
      )
    case 'photos':
      if (!object[key]) return 'null'
      return escape(
        `ARRAY[${object[key].map(() => '%L').join(',')}]::varchar[]`,
        ...object[key]
      )
    case 'location':
    case 'coordinates':
      if (!object[key]) return 'null'
      return escape('%L::jsonb', JSON.stringify(object[key]))
    case 'is_closed':
      return `${object[key]}`
    default:
      return 'null'
  }
}

export const saveBusiness = (business) => {
  let columns = [
    'id',
    'name',
    'alias',
    'is_closed',
    'url',
    'phone',
    'display_phone',
    'categories',
    'price',
    'location',
    'coordinates',
    'photos',
    'hours',
    'special_hours'
  ]

  // TODO: upload photos to another source to avoid hotlinking

  columns = columns.filter(columnName => business[columnName] != null)

  return knex.raw(`
    INSERT INTO businesses(${columns.join(', ')})
    VALUES (${
      columns
        .map(columnName => formatValueForColumn(columnName, business))
        .join(', ')
    })
    ON CONFLICT (id) DO UPDATE
    SET ${
      columns
        .map(columnName => `${columnName} = EXCLUDED.${columnName}`)
        .join(',')
    }
  `)
}

export const isBusinessAdded = async (user_id, business_id, collection_id) => {
  let query = knex('collections')
    .join('business_collections', 'business_collections.collection_id', 'collections.id')
    .where('collections.user_id', user_id)
    .where('business_collections.business_id', business_id)

  if (collection_id) {
    query.where('collections.id', collection_id)
  }

  return query
    .first('business_collections.id')
    .then(res => {
      if (res && res.id) {
        return true
      }
      return false
    })
}

export const getBusinessesByCollectionId = async (collection_id, args = {}) => {
  let query = knex('business_collections')
    .join('businesses', 'businesses.id', 'business_collections.business_id')
    .where('business_collections.collection_id', collection_id)

  let countQuery = query.clone()
    
  if (args.limit && args.limit > 0) {
    query.limit(args.limit)
  }

  if (args.offset && args.offset > 0) {
    query.offset(args.offset)
  }

  let business = await query
    .distinct(
      'businesses.id',
      'business_collections.created_at',
      'businesses.name',
      'businesses.alias',
      'businesses.is_closed',
      'businesses.phone',
      'businesses.display_phone',
      'businesses.categories',
      'businesses.url',
      'businesses.price',
      'businesses.location',
      'businesses.coordinates',
      'businesses.photos',
      'businesses.hours',
      'businesses.special_hours'
    )
    .orderBy('business_collections.created_at', 'ASC')

  let total = await countQuery
    .first(knex.raw('count(distinct businesses.id)'))
    .then(res => res.count)
  
  return {
    total,
    business
  }
}

export const addBusinessToCollection = (business_id, collection_id) => {
  return knex('business_collections')
    .insert({ business_id, collection_id })
}