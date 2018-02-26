exports.up = function(knex, Promise) {
  return knex.schema.createTable('events', table => {
    table.increments('id').primary();
    table.text('title');
    table.date('start');
    table.date('end');
    table.boolean('allDay');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('events');
};
