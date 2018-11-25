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
