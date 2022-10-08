import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('coupons', (table) => {
    table.uuid('id').primary();
    table.string('name').unique().notNullable();
    table.text('desc').nullable();
    table.decimal('discount_percent').notNullable();
    table.timestamps(true, true);
  })

  await knex.schema.createTable('coupons_users', (table) => {
    table.uuid('coupon_id').notNullable().references('id').inTable('coupons');
    table.uuid('user_id').notNullable().references('id').inTable('users');
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('coupons');
  await knex.schema.dropTable('coupons_users');
}

