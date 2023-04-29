import { CognitoUserPoolTriggerHandler } from 'aws-lambda';

export const handler: CognitoUserPoolTriggerHandler = async event => {
  console.log(event);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const expectedAnswer = event.request.privateChallengeParameters!.secretLoginCode;
  event.response.answerCorrect = event.request.challengeAnswer === expectedAnswer;
  return event;
};
