exports.seed = function (knex) {
  return knex('insurance_plans')
    .del()
    .then(() => knex('insurance_plans').insert([
      { type: 'none', description: 'Без страховки', price: 0 },
      { type: 'basic', description: 'Базовая страховка', price: 4 },
      { type: 'extended', description: 'Расширенная страховка', price: 6 },
    ]));
};
