import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('order_items', (table) => {
    table.uuid('id').primary();
    table.integer('quantity').defaultTo(1);
    table.decimal('total').notNullable();
    table.uuid('order_detail_id').notNullable();
    table.foreign('order_detail_id').references('id').inTable('order_details');
    table.integer('product_id').notNullable();
    table.foreign('product_id').references('id').inTable('products');
    table.timestamps(true, true);
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('order_items');
}

