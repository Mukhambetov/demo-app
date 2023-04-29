/**
 *
 * @param knex {Knex}
 * @return {Knex.SchemaBuilder}
 */
exports.up = function (knex) {
    return knex.schema
        .raw('CREATE EXTENSION IF NOT EXISTS "postgis"')
        .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
        .createTable("bikes", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
            table.string("bike_type").notNullable();
            table.specificType("last_known_location", "geometry(point, 4326)").notNullable();
            table.boolean("is_rented").notNullable().defaultTo(false);
            table.timestamps();
        })
        .createTable("users", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
            table.string("phone").unique().notNullable();
            table.string("name").notNullable();
            table.timestamps();
        })
        .createTable("tariffs", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
            table.string("bike_type").notNullable();
            table.integer("minutes").notNullable();
            table.integer("cost").notNullable();
            table.boolean("is_active").notNullable().defaultTo(true);
            table.timestamps();
        })
        .createTable("promo_codes", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
            table.string("code").unique().notNullable();
            table.enu("discount_type", ["percentage", "fixed_amount"]).notNullable();
            table.integer("discount_value").notNullable();
            table.timestamp("start_time").notNullable();
            table.timestamp("end_time").notNullable();
            table.timestamps();
        })
        .createTable("referral_codes", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
            table.string("code").unique().notNullable();
            table
                .uuid("user_id")
                .references("id")
                .inTable("users")
                .onDelete("CASCADE");
            table.integer("reward_amount").notNullable();
            table.timestamps();
        })
        .createTable("referral_uses", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
            table
                .uuid("referral_code_id")
                .references("id")
                .inTable("referral_codes")
                .onDelete("CASCADE");
            table
                .uuid("user_id")
                .references("id")
                .inTable("users")
                .onDelete("CASCADE");
            table.timestamp('redeemed_at');
        })
        .createTable("rentals", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
            table
                .uuid("bike_id")
                .references("id")
                .inTable("bikes")
                .onDelete("CASCADE");
            table
                .uuid("user_id")
                .references("id")
                .inTable("users")
                .onDelete("CASCADE");
            table.timestamp("start_time").notNullable();
            table.timestamp("end_time");
            table.specificType("start_location", "geometry(point, 4326)").notNullable();
            table.specificType("end_location", "geometry(point, 4326)");
            table.uuid('referral_use_id')
                .references('id')
                .inTable('referral_uses')
                .onDelete("CASCADE");
            table.uuid('promo_code_id')
                .references('id')
                .inTable('promo_codes')
                .onDelete("CASCADE");
            table.integer('original_cost')
            table.integer('final_cost')
            table.timestamps();
        })
        .createTable("parking_zones", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
            table.string("name").notNullable();
            table.specificType("zone", "geometry(polygon, 4326)").notNullable();
            table.timestamps();
        })
        .createTable("riding_zones", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
            table.string("name").notNullable();
            table.specificType("zone", "geometry(polygon, 4326)").notNullable();
            table.timestamps();
        })
        .createTable("bike_movements", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
            table
                .uuid("bike_id")
                .references("id")
                .inTable("bikes")
                .onDelete("CASCADE");
            table.specificType("location", "geometry(point, 4326)").notNullable();
            table.timestamp("recorded_at").notNullable().defaultTo(knex.raw('now()'))
            table.timestamps();
        })
        /*.raw(`
            CREATE OR REPLACE VIEW bike_movements_with_zones AS
            SELECT
              bm.rental_id,
              bm.recorded_at,
              bm.location,
              rz.id IS NOT NULL AS inside_zone
            FROM
              bike_movements AS bm
            LEFT JOIN riding_zones AS rz ON ST_Contains(rz.geom, bm.location);`)
        .raw(`
          CREATE OR REPLACE FUNCTION create_and_insert_bike_movements_partition()
            RETURNS TRIGGER AS $$
            DECLARE
              partition_date TEXT;
              partition_table_name TEXT;
            BEGIN
              partition_date := to_char(NEW.recorded_at, 'YYYY_MM');
              partition_table_name := 'bike_movements_' || partition_date;

              -- Проверка на существование таблицы и создание, если не существует
              IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = partition_table_name) THEN
                EXECUTE format('
                  CREATE TABLE %I (
                    CHECK (NEW.recorded_at >= ''%s''::DATE AND NEW.recorded_at < ''%s''::DATE + INTERVAL ''1 month'')
                  ) INHERITS (bike_movements);
                ', partition_table_name, partition_date, partition_date);

                -- Создание индекса для партиционной таблицы
                EXECUTE format('
                  CREATE INDEX %I ON %I (recorded_at);
                ', partition_table_name || '_timestamp_idx', partition_table_name);
              END IF;

              -- Вставка данных в соответствующую партиционную таблицу
              EXECUTE format('INSERT INTO %I VALUES ($1.*)', partition_table_name) USING NEW;
              RETURN NULL;
            END;
            $$ LANGUAGE plpgsql;

        `).raw(`
        CREATE TRIGGER bike_movements_insert_trigger
          BEFORE INSERT ON bike_movements
          FOR EACH ROW
          EXECUTE FUNCTION create_and_insert_bike_movements_partition();

        `)*/
};


exports.down = async (knex) => {
    return knex.schema.dropTableIfExists('stores')
        .dropTableIfExists("bike_movements")
        .dropTableIfExists("parking_zones")
        .dropTableIfExists("riding_zones")
        .dropTableIfExists("referral_codes")
        .dropTableIfExists("promo_codes")
        .dropTableIfExists("tariffs")
        .dropTableIfExists("rentals")
        .dropTableIfExists("users")
        .dropTableIfExists("bikes")
        .raw('DROP EXTENSION IF EXISTS "uuid-ossp"')
        .raw('DROP EXTENSION IF EXISTS postgis;')
        .raw('DROP EXTENSION IF EXISTS btree_gist;');
};
