import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('order_details', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').unique().notNullable();
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.decimal('total').defaultTo(0.00);
    table.timestamps(true, true);
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('order_details');
}

