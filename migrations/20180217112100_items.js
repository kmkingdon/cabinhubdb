exports.up = function(knex, Promise) {
  return knex.schema.createTable('items', table => {
    table.increments('id').primary();
    table.text('itemName');
    table.integer('currentAmmount');
    table.text('cat');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('items');
};
