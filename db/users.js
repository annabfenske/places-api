import knex from '../connectors/postgres'

export const createUser = (fields, returning = '*') => {
  return knex('users')
    .insert(fields)
    .returning(returning)
    .then(rows => rows[0])
}

export const getUserById = (id, fields = '*') => {
  return knex('users')
    .where('id', id)
    .select(fields)
    .then(rows => rows[0])
}

export const getUserByEmail = (email, fields = '*') => {
  return knex('users')
    .where('email', email)
    .select(fields)
    .then(rows => rows[0])
}

export const updateUserById = (id, fields, returning = '*') => {
  return knex('users')
    .where('id', id)
    .update({
      ...fields,
      updated_at: knex.fn.now()
    })
    .returning(returning)
    .then(rows => rows[0])
}
