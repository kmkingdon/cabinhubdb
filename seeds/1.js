
exports.seed = function(knex, Promise) {
  return knex('events').del()
    .then(function () {
      return knex('events').insert([
        {
          id: 1,
          title: 'Long Event',
          start: new Date(2018, 0, 7),
          end: new Date(2018, 0, 10),
          allDay: true
        },

        {
          id: 2,
          title: 'DTS STARTS',
          start: new Date(2018, 0, 13),
          end: new Date(2018, 0, 20),
          allDay: true
        },

        {
          id: 3,
          title: 'DTS ENDS',
          start: new Date(2018, 0, 6),
          end: new Date(2018, 0, 13),
          allDay: true
        },

        {
          id: 4,
          title: 'Some Event',
          start: new Date(2018, 0, 20),
          end: new Date(2018, 0, 22),
          allDay: true
        }
      ]).then(() => {
          return knex.raw("ALTER SEQUENCE events_id_seq RESTART WITH 5;");
        });
    });
};
