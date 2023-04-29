import { CognitoUserPoolTriggerHandler } from 'aws-lambda';
import { db } from './knex';

const TABLE_NAME = 'users';

export const handler: CognitoUserPoolTriggerHandler = async event => {
  console.log(event);
  try {
    const { phone_number: phone, sub } = event.request.userAttributes;
    await db(TABLE_NAME).update<any>({ id: sub }).where({ username: phone });
    return event;
  } catch (e) {
    console.log(e, 'Could not save user');
    return event;
  }
};
