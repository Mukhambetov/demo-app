const phonePatter = /^(?:\+?7|8)?(7\d{9})$/;

function validatePhoneNumber(phone) {
  return !!phone && phonePatter.test(phone);
}

export const handler = async (event) => {
  console.log(event);
  if (validatePhoneNumber(event.request.userAttributes.phone_number)) {
    event.response.autoConfirmUser = true;
    event.response.autoVerifyPhone = true;
  } else {
    throw new Error('SSO-004');
  }
  return event;
};
