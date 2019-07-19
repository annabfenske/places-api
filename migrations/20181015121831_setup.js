
exports.up = function(knex, Promise) {
  return knex
    .raw(
      `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
            SCHEMA public
            VERSION "1.1";
      `
    )
    .then(() => knex.schema.createTable('users', function(table) {
      table
        .uuid("id")
        .defaultTo(knex.raw("uuid_generate_v4()"))
        .primary()
      table
        .string('first_name')
        .notNull()
      table
        .string('last_name')
        .notNull()
      table
        .string('email')
        .notNull()
      table
        .string('password')
        .notNull()
      table
        .timestamp('created_at')
        .notNull()
        .defaultTo(knex.fn.now())
      table
        .timestamp('updated_at')
        .notNull()
        .defaultTo(knex.fn.now())

      table.unique('email')
    }))
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};
