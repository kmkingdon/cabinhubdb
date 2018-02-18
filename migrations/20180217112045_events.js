exports.up = function(knex, Promise) {
  return knex.schema.createTable('events', table => {
    table.increments('id').primary();
    table.text('title');
    table.text('start');
    table.text('end');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('events');
};
