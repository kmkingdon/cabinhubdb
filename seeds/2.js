
exports.seed = function(knex, Promise) {
  return knex('items').del()
    .then(function () {
      return knex('items').insert([
        { id: 1,
          itemName: 'Paper Towels',
          currentAmmount: 4,
          cat: "Paper Products",
        },
        { id: 2,
          itemName: 'Toilet Paper',
          currentAmmount: 10,
          cat: "Paper Products",
        },
        { id: 3,
          itemName: 'Coffee',
          currentAmmount: 0,
          cat: "Kitchen",
        },
        { id: 4,
          itemName: 'Ketchup',
          currentAmmount: 1,
          cat: "Kitchen",
        },
      ]).then(() => {
          return knex.raw("ALTER SEQUENCE items_id_seq RESTART WITH 5;");
        });
    });
};
