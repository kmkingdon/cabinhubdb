
exports.seed = function(knex, Promise) {
  return knex('events').del()
    .then(function () {
      return knex('events').insert([
        {
          id: 1,
          title: 'Long Event',
          start: "2018, 0, 7",
          end: "2018, 0, 10",
        },

        {
          id: 2,
          title: 'DTS STARTS',
          start: "2018, 0, 13",
          end: "2018, 0, 20",
        },

        {
          id: 3,
          title: 'DTS ENDS',
          start: "2018, 0, 6",
          end: "2018, 0, 13",
        },

        {
          id: 4,
          title: 'Some Event',
          start: "2018, 0, 20",
          end: "2018, 0, 22",
        }
      ]).then(() => {
          return knex.raw("ALTER SEQUENCE events_id_seq RESTART WITH 5;");
        });
    });
};
