import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('wishlists', (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.timestamps(true, true);
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('wishlists');
}

