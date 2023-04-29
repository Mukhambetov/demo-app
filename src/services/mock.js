const knex = require("../db/knex")


const getRandomInRange = (min, max) => {
    return Math.random() * (max - min) + min;
};

const insertRandomBikeMovement = async () => {
    // Получаем список всех велосипедов
    const bikes = await knex('bikes').select('id');

    // Генерируем случайные координаты в пределах Алматы
    const randomLongitude = getRandomInRange(76.85, 76.95);
    const randomLatitude = getRandomInRange(43.2, 43.3);

    // Выбираем случайный велосипед
    const randomBikeIndex = Math.floor(Math.random() * bikes.length);
    const randomBikeId = bikes[randomBikeIndex].id;

    // Вставляем новую запись в таблицу bike_movements
    await knex('bike_movements').insert({
        bike_id: randomBikeId,
        location: knex.raw(`ST_SetSRID(ST_MakePoint(${randomLongitude}, ${randomLatitude}), 4326)`),
    });

    console.log(`Inserted a new bike movement for bike id: ${randomBikeId}`);
};

module.exports = {insertRandomBikeMovement}
