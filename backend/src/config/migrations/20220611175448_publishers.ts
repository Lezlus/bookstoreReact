import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('publishers', (table) => {
    table.increments('id'),
    table.string('name').notNullable().unique();
    table.timestamps(true, true)
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('publishers');
}

