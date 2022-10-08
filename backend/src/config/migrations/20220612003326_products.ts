import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('products', (table) => {
    table.increments('id');
    table.string('slug').notNullable().unique();
    table.string('title').notNullable().unique();
    table.text('desc').nullable();
    table.decimal('price').defaultTo(0.00);
    table.string('media').defaultTo('Manga');
    table.integer('publisher_id').notNullable();
    table.foreign('publisher_id').references('id').inTable('publishers');
    table.date('release_date').nullable();
    table.text('themes').nullable();
    table.string('age_rating').nullable();
    table.string('page_count').nullable();
    table.string('dimensional_weight').nullable();
    table.boolean('is_erotica').defaultTo(false);
    table.string('img_path_lg').notNullable();
    table.string('img_path_sm').nullable();
  })

  await knex.schema.createTable('products_genres', (table) => {
    table.integer('product_id').references('id').inTable('products');
    table.integer('genre_id').references('id').inTable('genres');
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('products');
  await knex.schema.dropTable('products_genres');
}

