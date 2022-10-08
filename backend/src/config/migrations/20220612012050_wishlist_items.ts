import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('wishlist_items', (table) => {
    table.uuid('id').primary();
    table.integer('quantity').defaultTo(1);
    table.integer('product_id').notNullable();
    table.foreign('product_id').references('id').inTable('products');
    table.timestamps(true, true);
  })

  await knex.schema.createTable('wishlists_wishlist_items', (table) => {
    table.uuid('wishlist_id').notNullable().references('id').inTable('wishlists');
    table.uuid('wishlist_item_id').notNullable().references('id').inTable('wishlist_items');
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('wishlist_items');
  await knex.schema.dropTable('wishlist_wishlist_items');
}

