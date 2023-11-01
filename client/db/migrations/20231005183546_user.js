/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("user", table => {
    table.increments().primary();
    table.string("username", 128).notNullable();
    table.string("profile_img", 128);
    table.boolean("logig_status");
    table.bigInteger("logout_timestamp");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("user");
};
