import knex from '../connectors/postgres'

export const getIconById = (id, fields = '*') => {
  return knex('icons')
    .where('id', id)
    .first(fields)
}

export const getColorById = (id, fields = '*') => {
  return knex('colors')
    .where('id', id)
    .first(fields)
}