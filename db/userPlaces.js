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

export const hasUserAddedPlace = async (user_id, place_id) => {
  let place = await knex('user_places')
    .join('user_categories', 'user_places.category_id', 'user_categories.id')
    .where('user_places.place_id', place_id)
    .where('user_categories.user_id', user_id)
    .select('user_places.id')
    .limit(1)

  if (place) {
    return true
  } else {
    return false
  }
}

export const getPlacesByBbox = (bbox, fields = '*') => {
  // TODO: fetch places by latitude and longitude given bbox
  return []
}
