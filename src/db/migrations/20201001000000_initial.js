/**
 *
 * @param knex {Knex}
 * @return {Knex}
 */
exports.up = function (knex) {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "postgis"')
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('bike_types', (table) => {
      table.uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('name')
        .notNullable();
      table.string('type')
        .notNullable()
        .unique();
      table.boolean('is_active')
        .notNullable()
        .defaultTo(true);
      table.timestamps(true, true);
    })
    .createTable('device_states', (table) => {
      table.string('device_name')
        .unique()
        .primary();
      table.boolean('is_locked')
        .notNullable()
        .defaultTo(true);
      table.specificType('location', 'geometry(point, 4326)')
        .notNullable();
      table.float('altitude', 10, 2);
      table.jsonb('payload');
      table.timestamp('created_at')
        .notNullable()
        .defaultTo(knex.raw('now()'));
    })
    .createTable('device_states_history', (table) => {
      table.string('device_name')
        .primary();
      table.boolean('is_locked')
        .notNullable()
        .defaultTo(true);
      table.specificType('location', 'geometry(point, 4326)')
        .notNullable();
      table.float('altitude', 10, 2);
      table.jsonb('payload');
      table.timestamp('created_at')
        .notNullable()
        .defaultTo(knex.raw('now()'));
    })
    .createTable('bikes', (table) => {
      table.uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('bike_number')
        .unique();
      table.string('bike_name');
      table.uuid('bike_type_id')
        .notNullable()
        .references('id')
        .inTable('bike_types')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.specificType('last_known_location', 'geometry(point, 4326)')
        .notNullable();
      table.string('device_name_id')
        .references('device_name')
        .inTable('device_states')
        .nullable()
        .unique();
      table.boolean('is_active')
        .notNullable()
        .defaultTo(true);
      table.timestamps();
    })
    .createTable('tariff_plans', (table) => {
      table.uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('bike_type_id')
        .notNullable()
        .references('id')
        .inTable('bike_types')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.integer('tier')
        .notNullable();
      table.integer('start_time')
        .notNullable();
      table.integer('end_time');
      table.integer('cost')
        .notNullable();
      table.boolean('is_minute_rate')
        .notNullable()
        .defaultTo(false);
      table.boolean('is_active')
        .notNullable()
        .defaultTo(true);
      table.timestamps(true, true);
    })
    .createTable('promo_codes', (table) => {
      table.uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('code')
        .unique()
        .notNullable();
      table.enu('discount_type', ['percentage', 'fixed_amount'])
        .notNullable();
      table.integer('discount_value')
        .notNullable();
      table.timestamp('start_time')
        .notNullable();
      table.timestamp('end_time')
        .notNullable();
      table.boolean('is_active')
        .notNullable()
        .defaultTo(true);
      table.timestamps();
    })
    .createTable('referral_codes', (table) => {
      table.uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('code')
        .unique()
        .notNullable();
      table.string('short_link')
        .unique()
        .notNullable();
      table.integer('reward_amount')
        .notNullable();
      table.timestamps();
    })
    .createTable('users', (table) => {
      table.uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('referral_code_id')
        .references('id')
        .inTable('referral_codes')
        .unique()
        .nullable();
      table.string('phone')
        .unique()
        .notNullable();
      table.string('name')
        .notNullable();
      table.boolean('terms_accepted')
        .notNullable()
        .defaultTo(false);
      table.timestamps();
    })
    .createTable('insurance_plans', (table) => {
      table.enu('type', ['none', 'basic', 'extended'])
        .unique()
        .notNullable();
      table.string('description')
        .notNullable();
      table.decimal('price', 10, 2)
        .notNullable();
      table.boolean('is_active')
        .notNullable()
        .defaultTo(true);
      table.timestamps(true, true);
    })
    .createTable('rentals', (table) => {
      table.uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table
        .uuid('bike_id')
        .references('id')
        .inTable('bikes')
        .onDelete('CASCADE');
      table
        .uuid('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.timestamp('start_time')
        .notNullable();
      table.timestamp('end_time');
      table.specificType('start_location', 'geometry(point, 4326)')
        .notNullable();
      table.specificType('end_location', 'geometry(point, 4326)');
      table.enu('insurance_type', ['none', 'basic', 'extended'])
        .notNullable()
        .defaultTo('none')
        .references('type')
        .inTable('insurance_plans');
      table.integer('original_cost');
      table.integer('final_cost');
      table.timestamps();
    })
    .createTable('referral_uses', (table) => {
      table.uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table
        .uuid('referral_code_id')
        .references('id')
        .inTable('referral_codes')
        .onDelete('CASCADE');
      table
        .uuid('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .uuid('rental_id')
        .references('id')
        .inTable('rentals')
        .onDelete('CASCADE');
      table.timestamp('redeemed_at');
      table.unique(['referral_code_id', 'user_id']);
    })
    .createTable('promo_code_uses', (table) => {
      table.uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table
        .uuid('promo_code_id')
        .references('id')
        .inTable('promo_codes')
        .onDelete('CASCADE');
      table
        .uuid('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .uuid('rental_id')
        .references('id')
        .inTable('rentals')
        .onDelete('CASCADE');
      table.timestamp('used_at');
      table.unique(['promo_code_id', 'user_id']);
    })
    .createTable('payment_methods', (table) => {
      table.uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('user_id')
        .unsigned()
        .notNullable();
      table.foreign('user_id')
        .references('users.id')
        .onDelete('CASCADE');
      table.string('card_brand')
        .notNullable();
      table.string('card_number')
        .notNullable();
      table.integer('exp_month')
        .notNullable();
      table.integer('exp_year')
        .notNullable();
      table.integer('cvv')
        .notNullable();
      table.boolean('is_default')
        .notNullable()
        .defaultTo(false);
      table.boolean('is_active')
        .notNullable()
        .defaultTo(true);
      table.timestamp('created_at')
        .defaultTo(knex.fn.now());
      table.timestamp('updated_at')
        .defaultTo(knex.fn.now());
    })
    .createTable('parking_zones', (table) => {
      table.uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('name')
        .notNullable();
      table.specificType('zone', 'geometry(polygon, 4326)')
        .notNullable();
      table.boolean('is_active')
        .notNullable()
        .defaultTo(true);
      table.timestamps();
    })
    .createTable('riding_zones', (table) => {
      table.uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('name')
        .notNullable();
      table.specificType('zone', 'geometry(polygon, 4326)')
        .notNullable();
      table.boolean('is_active')
        .notNullable()
        .defaultTo(true);
      table.timestamps();
    })
    .createTable('bms_information', (table) => {
      table.uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('device_id').notNullable()
        .references('device_name')
        .inTable('device_states');
      table.string('battery_status').notNullable();
      table.float('current');
      table.integer('cycles');
      table.float('temperature');
      table.float('voltage');
      table.float('total_capacity');
      table.jsonb('meta');
      table.timestamp('report_date')
        .notNullable()
        .defaultTo(knex.raw('now()'));
    })
    .raw(`CREATE OR REPLACE FUNCTION create_and_insert_device_states_history_partition()
    RETURNS TRIGGER AS $$
DECLARE
    partition_date TEXT;
    partition_table_name TEXT;
BEGIN
    partition_date := to_char(NEW.recorded_at, 'YYYY_MM');
    partition_table_name := 'device_states_' || partition_date;

    -- Проверка на существование таблицы и создание, если не существует
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = partition_table_name) THEN
        EXECUTE format('
      CREATE TABLE %I (
        CHECK (created_at >= ''%s-01''::DATE AND created_at < ''%s-01''::DATE + INTERVAL ''1 month'')
      ) INHERITS (device_states_history);
    ', partition_table_name, partition_date, partition_date);

        -- Создание индекса для партиционной таблицы
        EXECUTE format('CREATE INDEX %I ON %I (created_at);',
                       partition_table_name || '_created_at_idx', partition_table_name);
    END IF;

    -- Вставка данных в соответствующую партиционную таблицу
    EXECUTE format('INSERT INTO %I VALUES ($1.*)', partition_table_name) USING NEW;

    insert into device_states (device_name, location, is_locked, altitude, payload, created_at)
    values (NEW.device_name, NEW.location, NEW.is_locked, NEW.latitude, NEW.payload, NEW.created_at)
    on conflict (device_name)
    do update set location = NEW.location,
                  is_locked = NEW.is_locked,
                  altitude = NEW.altitude,
                  payload = NEW.payload,
                  created_at = now();

    UPDATE bikes
        SET last_known_location = NEW.location
        WHERE id = NEW.device_name;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER device_states_insert_trigger
    BEFORE INSERT ON device_states_history
    FOR EACH ROW
EXECUTE FUNCTION create_and_insert_device_states_partition();
`);
};

exports.down = async (knex) => knex.schema.dropTableIfExists('stores')
  .dropTableIfExists('device_states')
  .dropTableIfExists('device_states_history')
  .dropTableIfExists('parking_zones')
  .dropTableIfExists('riding_zones')
  .dropTableIfExists('referral_codes')
  .dropTableIfExists('promo_codes')
  .dropTableIfExists('tariff_plans')
  .dropTableIfExists('rentals')
  .dropTableIfExists('users')
  .dropTableIfExists('bikes')
  .dropTableIfExists('bike_types')
  .dropTableIfExists('payment_methods')
  .dropTableIfExists('insurance_plans')
  .raw('DROP EXTENSION IF EXISTS "uuid-ossp"')
  .raw('DROP EXTENSION IF EXISTS postgis;')
  .raw('DROP EXTENSION IF EXISTS btree_gist;');
