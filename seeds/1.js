const bcrypt = require('bcrypt');

exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert([
        {
          id: 1,
          email: 'kmkingdon@gmail.com',
          username: 'Kevin Kingdon',
          password: bcrypt.hashSync('samplePassword', 10)
        },
        {
          id: 2,
          email: 'sample@gmail.com',
          username: 'Sample',
          password: bcrypt.hashSync('12345', 10)
        }
      ]).then(() => {
          return knex.raw("ALTER SEQUENCE users_id_seq RESTART WITH 3;");
        });
    });
};
