module.exports = {
  client: "pg",
  connection: process.env.PG_CONNECTION_STRING,
  migrations: {
    tableName: "knex_migrations"
  },
  seeds: {
    directory: "./seeds/dev"
  }
}

/* places-219216:us-central1:places-pg-dev */
