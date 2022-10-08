import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('cart_items', (table) => {
    table.uuid('id').primary();
    table.integer('product_id').notNullable();
    table.foreign('product_id').references('id').inTable('products');
    table.integer('quantity').defaultTo(1);
    table.uuid('cart_id').notNullable();
    table.foreign('cart_id').references('id').inTable('carts');
    table.timestamps(true, true);
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('cart_items');
}

