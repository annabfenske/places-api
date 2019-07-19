
exports.up = function(knex, Promise) {
  return knex.schema.createTable('businesses', function(table) {
    table
      .string('id')
      .primary()
    table
      .string('name')
      .notNull()
    table.string('alias')
    table.boolean('is_closed')
    table.string('url')
    table.string('phone')
    table.string('display_phone')
    table
      .specificType('categories', 'jsonb[]')
      .defaultTo(knex.raw('ARRAY[]::jsonb[]'))
      .notNull()
    table.string('price')
    table
      .jsonb('location')
      .defaultTo(knex.raw(`'{}'::jsonb`))
      .notNull()
    table
      .jsonb('coordinates')
      .defaultTo(knex.raw(`'{}'::jsonb`))
      .notNull()
    table
      .specificType('photos', 'varchar[]')
      .defaultTo(knex.raw('ARRAY[]::varchar[]'))
      .notNull()
    table
      .specificType('hours', 'jsonb[]')
      .defaultTo(knex.raw('ARRAY[]::jsonb[]'))
      .notNull()
    table
      .specificType('special_hours', 'jsonb[]')
      .defaultTo(knex.raw('ARRAY[]::jsonb[]'))
      .notNull()
    table
      .timestamp('created_at')
      .notNull()
      .defaultTo(knex.fn.now())
    table
      .timestamp('updated_at')
      .notNull()
      .defaultTo(knex.fn.now())
  })
  .then(() => knex.schema.createTable('collections', function(table) {
    table
      .uuid('id')
      .defaultTo(knex.raw('uuid_generate_v4()'))
      .primary()
    table
      .string('name')
      .notNull()
    table
      .uuid('user_id')
      .references('id')
      .inTable('users')
      .notNull()
    table
      .uuid('icon_id')
      .references('id')
      .inTable('icons')
      .notNull()
    table
      .uuid('color_id')
      .references('id')
      .inTable('colors')
      .notNull()
    table
      .timestamp('created_at')
      .notNull()
      .defaultTo(knex.fn.now())
    table
      .timestamp('updated_at')
      .notNull()
      .defaultTo(knex.fn.now())

    table.unique(['name', 'user_id'], 'unique_name_and_user')
  }))
  .then(() => knex.schema.createTable('business_collections', function(table) {
    table
      .uuid('id')
      .defaultTo(knex.raw('uuid_generate_v4()'))
      .primary()
    table
      .string('business_id')
      .references('id')
      .inTable('businesses')
      .notNull()
    table
      .uuid('collection_id')
      .references('id')
      .inTable('collections')
      .notNull()
    table
      .timestamp('created_at')
      .notNull()
      .defaultTo(knex.fn.now())
    
    table.unique(['business_id', 'collection_id'], 'unique_business_and_collection')
  }))
  .then(() =>
    knex.raw(
      `
      -- Create trigger for businesses table
      CREATE OR REPLACE FUNCTION businesses_updated()
      RETURNS TRIGGER
      AS $$
      BEGIN
      IF
        NEW.name <> OLD.name OR
        NEW.alias <> OLD.alias OR
        NEW.is_closed <> OLD.is_closed OR
        NEW.url <> OLD.url OR
        NEW.phone <> OLD.phone OR
        NEW.display_phone <> OLD.display_phone OR
        NEW.categories <> OLD.categories OR
        NEW.location <> OLD.location OR
        NEW.coordinates <> OLD.coordinates OR
        NEW.photos <> OLD.photos OR
        NEW.hours <> OLD.hours OR
        NEW.special_hours <> OLD.special_hours
      THEN
      NEW.updated_at = NOW();
      END IF;
      RETURN NEW;
      END;
      $$
      LANGUAGE 'plpgsql';

      CREATE TRIGGER businesses_updated_trigger BEFORE UPDATE
      ON businesses FOR EACH ROW
      EXECUTE PROCEDURE
      businesses_updated();


      -- Create trigger for collections table
      CREATE OR REPLACE FUNCTION collections_updated()
      RETURNS TRIGGER
      AS $$
      BEGIN
      IF
        NEW.name <> OLD.name OR
        NEW.icon_id <> OLD.icon_id OR
        NEW.color_id <> OLD.color_id
      THEN
      NEW.updated_at = NOW();
      END IF;
      RETURN NEW;
      END;
      $$
      LANGUAGE 'plpgsql';

      CREATE TRIGGER collections_updated_trigger BEFORE UPDATE
      ON collections FOR EACH ROW
      EXECUTE PROCEDURE
      collections_updated();
      `
    )  
  )
};

exports.down = function(knex, Promise) {
  return knex.raw(
    `
    DROP TRIGGER collections_updated_trigger ON collections;
    DROP FUNCTION collections_updated;

    DROP TRIGGER businesses_updated_trigger ON businesses;
    DROP FUNCTION businesses_updated;
    `
  )
    .then(() => knex.schema.dropTable('business_collections'))
    .then(() => knex.schema.dropTable('collections'))
    .then(() => knex.schema.dropTable('businesses'))
};
