import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('favorite_items', (table) => {
    table.uuid('id').primary();
    table.integer('product_id').notNullable();
    table.foreign('product_id').references('id').inTable('products');
    table.uuid('favorite_id').notNullable();
    table.foreign('favorite_id').references('id').inTable('favorites');
    table.timestamps(true, true);
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('favorite_items');
}

