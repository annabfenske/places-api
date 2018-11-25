import knex from '../connectors/postgres'

export const createPlace = (fields, category_id, returning = '*') => {
  return knex('user_places')
    .insert({ ...fields, category_id })
    .returning(returning)
    .then(rows => rows[0])
}

export const getPlaceById = (id, fields = '*') => {
  return knex('user_places')
    .where('id', id)
    .select(fields)
    .then(rows => rows[0])
}

export const getPlacesByBbox = (bbox, fields = '*') => {
  // TODO: fetch places by latitude and longitude given bbox
  return []
}
