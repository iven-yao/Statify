// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'pg',
    connection: {
      user: 'statify',
      password: '1234',
      database: 'statify'
    },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  },

};
