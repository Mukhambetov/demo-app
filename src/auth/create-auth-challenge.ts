import { CognitoUserPoolTriggerHandler } from 'aws-lambda';
import axios from 'axios';

async function sendSecret(msisdn: string) {
  if (process.env.MOCK === 'true') {
    return '123456';
  }
  const secret = (Math.random() * 1000000).toFixed(0).padStart(6, '0');
  try {
    await axios.get('http://3.236.149.70:8080/sms/send-sms', {
      params: {
        msisdn: msisdn,
        msg: `CODE-${secret}`,
      },
    });
  } catch (e) {
    console.log(e);
  }
  return secret;
}

export const handler: CognitoUserPoolTriggerHandler = async event => {
  let secretLoginCode: string;
  console.log(event);
  if (!event.request.session || !event.request.session.length) {
    // This is a new auth session
    // Generate a new secret login code and mail it to the user
    secretLoginCode = await sendSecret(event.request.userAttributes.phone_number);
  } else {
    // There's an existing session. Don't generate new digits but
    // re-use the code from the current session. This allows the user to
    // make a mistake when keying in the code and to then retry, rather
    // the needing to e-mail the user an all new code again.
    const previousChallenge = event.request.session.slice(-1)[0];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    secretLoginCode = previousChallenge.challengeMetadata!.match(/CODE-(\d*)/)![1];
  }

  // This is sent back to the client app
  event.response.publicChallengeParameters = { phone: event.request.userAttributes.phone_number };

  // Add the secret login code to the private challenge parameters
  // so it can be verified by the "Verify Auth Challenge Response" trigger
  event.response.privateChallengeParameters = { secretLoginCode };

  // Add the secret login code to the session so it is available
  // in a next invocation of the "Create Auth Challenge" trigger
  event.response.challengeMetadata = `CODE-${secretLoginCode}`;

  return event;
};
