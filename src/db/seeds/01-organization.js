exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("rentals").del();
  await knex("promo_codes").del();
  await knex("referral_uses").del();
  await knex("referral_codes").del();
  await knex("tariffs").del();
  await knex("users").del();
  await knex("bike_movements").del();
  await knex("bikes").del();
  await knex("parking_zones").del();
  await knex("riding_zones").del();

  // Insert seed data
  await knex("bikes").insert([
    {
      bike_type: "simple",
      last_known_location: knex.raw("ST_SetSRID(ST_MakePoint(30.12345, 50.12345), 4326)"),
      is_rented: false,
    },
    // ... other bikes
  ]);

  await knex("users").insert([
    {
      id: '842a747d-8b53-4465-9d4c-fd163d9c470c',
      phone: "1234567890",
      name: "John Doe",
    },
    // ... other users
  ]);

  await knex("tariffs").insert([
    {
      bike_type: "simple",
      minutes: 5,
      cost: 0,
      is_active: true,
    },
    // ... other tariffs
  ]);

  await knex("promo_codes").insert([
    {
      code: "PROMO10",
      discount_type: "percentage",
      discount_value: 10,
      start_time: "2023-01-01T00:00:00Z",
      end_time: "2023-12-31T23:59:59Z",
    },
  ]);

/*  await knex("referral_codes").insert([
    {
      code: "REFER123",
      user_id: "abcd1234-abcd-1234-abcd-123456789abd",
      reward_amount: 100,
    },
    // ... other referral codes
  ]);*/

  // Add seed data for other tables: parking_zones, riding_zones, etc.

  // ...

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

};
