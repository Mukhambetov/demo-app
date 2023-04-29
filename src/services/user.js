const AWS = require('aws-sdk');
const logger = require('../helpers/logger');
const { throwError } = require('../helpers/error');
const repository = require('../repositories/usersRepository');

const { CognitoIdentityServiceProvider } = AWS;
const cognito = new CognitoIdentityServiceProvider();

const generateTemporaryPassword = () => 'Aa123456#';

const create = async (entity, user) => {
  logger.debug({ entity, user }, 'Create user');
  const existingUsers = await repository
    .list({ phone: entity.phone, organizationId: user.organizationId });
  if (existingUsers && existingUsers.length) {
    if (existingUsers.find((eu) => eu.email === entity.email)) {
      throwError(409, '', 'User with such id already exists');
    }
  }
  const cUser = await cognito
    .adminCreateUser({
      UserPoolId: process.env.USER_POOL,
      Username: entity.phone,
      TemporaryPassword: generateTemporaryPassword(),
      DesiredDeliveryMediums: ['EMAIL'],
      UserAttributes: [
        {
          Name: 'email',
          Value: entity.email,
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
        {
          Name: 'phone_number',
          Value: entity.phone,
        },
        {
          Name: 'phone_number_verified',
          Value: 'true',
        },
      ],
    })
    .promise();
  return repository
    .create({ id: cUser.User.Username, ...entity, organizationId: user.organizationId });
};

const get = (id, user) => repository.get({ id, organizationId: user.organizationId });

const list = (filter, page, pageSize, user) => {
  logger.debug({
    filter, page, pageSize, user,
  }, 'List users');
  return repository.list({ ...filter, organizationId: user.organizationId }, page, pageSize);
};

const count = (filter, user) => repository
  .count({ ...filter, organizationId: user.organizationId });

const resendPassword = async (email) => {
  await cognito
    .adminCreateUser({
      UserPoolId: process.env.USER_POOL,
      Username: email,
      TemporaryPassword: generateTemporaryPassword(),
      DesiredDeliveryMediums: ['EMAIL'],
      MessageAction: 'RESEND',
    })
    .promise();
};

const update = (entity, id, user) => {
  logger.debug({ entity, id, user }, 'Updating user profiles');
  return repository
    .update(
      { ...entity, organizationId: user.organizationId },
      { organizationId: user.organizationId, id },
    );
};

const disableUser = async (id) => {
  await cognito
    .adminDisableUser({
      UserPoolId: process.env.USER_POOL,
      Username: id,
    })
    .promise();
};

const enableUser = async (id) => {
  await cognito
    .adminEnableUser({
      UserPoolId: process.env.USER_POOL,
      Username: id,
    })
    .promise();
};

const toggleEnabled = (enable, id, organizationId) => {
  logger.debug({ enable, id, organizationId }, 'ToggleEnabled');
  if (enable) {
    return enableUser(id);
  }
  return disableUser(id);
};

module.exports = {
  create,
  get,
  update,
  list,
  count,
  resendPassword,
  toggleEnabled,
};
