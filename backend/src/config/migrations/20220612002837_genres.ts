import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('genres', (table) => {
    table.increments('id');
    table.string('name').unique().notNullable();
    table.timestamps(true, true)
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('genres');
}

