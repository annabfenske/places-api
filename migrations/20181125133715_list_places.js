
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_categories', function(table) {
    table
      .uuid('id')
      .defaultTo(knex.raw('uuid_generate_v4()'))
      .primary()
    table
      .string('name')
      .notNull()
    table
      .string('icon')
      .notNull()
    table
      .string('color')
      .notNull()
    table
      .uuid('user_id')
      .references('id')
      .inTable('users')
      .notNull()
    table
      .timestamp('created_at')
      .notNull()
      .defaultTo(knex.fn.now())
    table
      .timestamp('updated_at')
      .notNull()
      .defaultTo(knex.fn.now())

    table.unique(['name', 'user_id'])
  })
    .then(_ => knex.schema.createTable('user_places', function(table) {
      table
        .uuid('id')
        .defaultTo(knex.raw('uuid_generate_v4()'))
        .primary()
      table
        .string('place_id')
        .notNull()
      table
        .string('name')
        .notNull()
      table
        .decimal('longitude')
        .notNull()
      table
        .decimal('latitude')
        .notNull()
      table
        .uuid('category_id')
        .references('id')
        .inTable('user_categories')
        .notNull()
      table
        .string('created_at')
        .notNull()
        .defaultTo(knex.fn.now())
      table
        .string('updated_at')
        .notNull()
        .defaultTo(knex.fn.now())

      table.unique(['place_id', 'category_id'])
    }))
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user_places')
    .then(_ => knex.schema.dropTable('user_categories'))
};
