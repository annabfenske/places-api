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
    .where('email', 'ILIKE', email)
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

export const getUserByCollectionId = (collection_id, returning = '*') => {
  return knex('collections')
    .join('users', 'collections.user_id', 'users.id')
    .where('collections.id', collection_id)
    .first(
      typeof returning === 'string'
        ? `users.${returning}`
        : returning.map(field => `users.${field}`)
    )
}
