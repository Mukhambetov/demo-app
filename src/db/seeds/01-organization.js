exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('rentals').del();
  await knex('promo_codes').del();
  await knex('referral_uses').del();
  await knex('referral_codes').del();
  await knex('users').del();
  await knex('bikes').del();
  await knex('parking_zones').del();
  await knex('riding_zones').del();

  await knex('users').insert([
    {
      id: '842a747d-8b53-4465-9d4c-fd163d9c470c',
      phone: '1234567890',
      name: 'John Doe',
    },
    // ... other users
  ]);

  await knex('promo_codes').insert([
    {
      code: 'PROMO10',
      discount_type: 'percentage',
      discount_value: 10,
      start_time: '2023-01-01T00:00:00Z',
      end_time: '2023-12-31T23:59:59Z',
    },
  ]);

  // Insert parking_zones
  await knex('parking_zones').insert([
    {
      name: 'Алматы парковка 1',
      zone: knex.raw('ST_GeomFromText(\'POLYGON((76.882691 43.222163,76.886275 43.218051,76.895314 43.222532,76.892432 43.226695,76.882691 43.222163))\', 4326)'),
    },
  ]);

  // Insert riding_zones
  await knex('riding_zones').insert([
    {
      name: 'Алматы район 1',
      zone: knex.raw('ST_GeomFromText(\'POLYGON((76.871426 43.230230,76.873714 43.226846,76.879875 43.230230,76.877792 43.233947,76.871426 43.230230))\', 4326)'),
    },
  ]);

  // Удаляем существующие записи
  await knex('tariff_plans').del();
  await knex('bike_types').del();

  // Вставляем записи для bike_types
  const bikeTypes = await knex('bike_types').insert([
    { type: 'simple', name: 'Эконом' },
    { type: 'eco', name: 'Эко' },
    { type: 'electra', name: 'Электро' },
  ]).returning('*');

  // Вставляем записи для tariff_plans
  await knex('tariff_plans').insert([
    {
      bike_type_id: bikeTypes[0].id,
      tier: 1,
      start_time: 0,
      end_time: 5,
      cost: 0,
      is_minute_rate: false,
    },
    {
      bike_type_id: bikeTypes[0].id,
      tier: 2,
      start_time: 5,
      end_time: 30,
      cost: 250,
      is_minute_rate: false,
    },
    {
      bike_type_id: bikeTypes[0].id,
      tier: 3,
      start_time: 30,
      cost: 10,
      is_minute_rate: true,
    },

    {
      bike_type_id: bikeTypes[1].id,
      tier: 1,
      start_time: 0,
      end_time: 5,
      cost: 0,
      is_minute_rate: false,
    },
    {
      bike_type_id: bikeTypes[1].id,
      tier: 2,
      start_time: 5,
      end_time: 30,
      cost: 300,
      is_minute_rate: false,
    },
    {
      bike_type_id: bikeTypes[1].id,
      tier: 3,
      start_time: 30,
      end_time: 60,
      cost: 200,
      is_minute_rate: false,
    },
    {
      bike_type_id: bikeTypes[1].id,
      tier: 4,
      start_time: 60,
      cost: 2000,
      is_minute_rate: false,
    },
  ]);

  // Inserts seed entries
  await knex('bikes').insert([
    {
      id: '842a747d-8b53-4465-9d4c-fd163d9c470c',
      bike_number: 'BIKE001',
      bike_name: 'Green Lightning',
      bike_type_id: bikeTypes[0].id,
      last_known_location: knex.raw('ST_SetSRID(ST_Point(0, 0), 4326)'),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      bike_number: 'BIKE002',
      bike_name: 'Blue Thunder',
      bike_type_id: bikeTypes[0].id,
      last_known_location: knex.raw('ST_SetSRID(ST_Point(0, 0), 4326)'),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      bike_number: 'BIKE003',
      bike_name: 'Red Flash',
      bike_type_id: bikeTypes[0].id,
      last_known_location: knex.raw('ST_SetSRID(ST_Point(0, 0), 4326)'),
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
};
