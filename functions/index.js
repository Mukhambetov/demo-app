// eslint-disable-next-line import/no-extraneous-dependencies
const functions = require('firebase-functions');
const knex = require('./knex');

// firebase functions:config:set loop.db_url="value1" loop.db_username="value2" loop.db_password="value2" loop.db_name="value2" loop.db_port="value2" loop.db_timezone="value2"

const TABLE_NAME = 'users';
exports.saveUserToFirestore = functions.auth.user()
  .onCreate(async (user) => {
    // Получение данных пользователя
    const { uid } = user;
    const { email } = user;
    const { displayName } = user;
    const { phoneNumber } = user;
    const { providerData } = user;

    // Определение типа авторизации
    let authType = 'unknown';
    if (providerData && providerData.length > 0) {
      const { providerId } = providerData[0];
      switch (providerId) {
        case 'password':
          authType = 'email';
          break;
        case 'phone':
          authType = 'phone';
          break;
        case 'google.com':
        case 'facebook.com':
        case 'twitter.com':
        case 'github.com':
        case 'apple.com':
          authType = 'sso';
          break;
        default:
          authType = 'unknown';
      }
    }

    // Сохранение данных пользователя в Firestore
    try {
      // eslint-disable-next-line no-unused-expressions
      await knex(TABLE_NAME).create({
        email,
        id: uid,
        display_name: displayName,
        phone_number: phoneNumber,
        auth_type: authType,
      });
      console.log('Пользователь успешно сохранен в Firestore:', uid);
    } catch (error) {
      console.error('Ошибка при сохранении пользователя в Firestore:', error);
    }
  });
