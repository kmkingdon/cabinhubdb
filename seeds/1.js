const bcrypt = require('bcrypt');

exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert([
        {
          id: 1,
          email: 'kmkingdon@gmail.com',
          username: 'Kevin Kingdon',
          password: bcrypt.hash('samplePassword', 10)
        }
      ]).then(() => {
          return knex.raw("ALTER SEQUENCE users_id_seq RESTART WITH 2;");
        });
    });
};
