exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('payment_methods')
    .del()
    .then(() =>
      // Inserts seed entries
      // eslint-disable-next-line implicit-arrow-linebreak
      knex('payment_methods').insert([
        {
          id: '1f4ad4a4-af8d-4b7d-a60e-1a1e126b95ac',
          user_id: '842a747d-8b53-4465-9d4c-fd163d9c470c', // Replace this with an existing user_id from the users table
          card_brand: 'Visa',
          card_number: '4242424242424242',
          exp_month: 12,
          exp_year: 2025,
          cvv: 123,
          is_default: true,
        },
        {
          id: '77a8d6c0-bf5a-4f2a-a269-2606e2d6e694',
          user_id: '842a747d-8b53-4465-9d4c-fd163d9c470c', // Replace this with an existing user_id from the users table
          card_brand: 'MasterCard',
          card_number: '5555555555554444',
          exp_month: 10,
          exp_year: 2024,
          cvv: 321,
          is_default: false,
        },
      ]));
};
