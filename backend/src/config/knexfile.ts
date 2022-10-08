import type { Knex } from "knex";
import configProperties from "./configProperties";
// Update with your config settings.

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      database: configProperties.db.name,
      host: configProperties.db.host,
      user: configProperties.db.user,
      password: configProperties.db.password,
      port: configProperties.db.port,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    }
  }
};

export default knexConfig
