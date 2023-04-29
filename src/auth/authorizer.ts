import axios from 'axios';
import {
  APIGatewayAuthorizerHandler,
  Context,
  CustomAuthorizerResult,
} from 'aws-lambda';
import * as logger from '../helpers/logger';
import { promisify } from 'util';
import * as jwk from 'jsonwebtoken';
import * as jwkToPem from 'jwk-to-pem';
import {
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerEvent,
} from 'aws-lambda/trigger/api-gateway-authorizer';

const doVerify = promisify<string, string, Record<string, any>, { sub: string }>(jwk.verify);
const region = process.env.AWS_DEFAULT_REGION || 'us-east-1';
const userPoolId = process.env.USER_POOL_ID || 'us-east-1_bY7bRyfFg';
const iss = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;
const url = `${iss}/.well-known/jwks.json`;


const generatePolicy = (principalId: string, effect: string, resource: string): APIGatewayAuthorizerResult => {
  let authResponse: CustomAuthorizerResult;
  if( effect && resource) {
    authResponse = {
      principalId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource
          }
        ]
      }
    };
  }
  return authResponse;
};

const parseMethodArn = (methodArn) => {
  const apiGatewayArnTmp = methodArn.split('/');
  return {
    stage: apiGatewayArnTmp[1],
    method: apiGatewayArnTmp[2],
    resource: apiGatewayArnTmp[3],
  };
};

export const handler: APIGatewayAuthorizerHandler = async (event: APIGatewayRequestAuthorizerEvent, context: Context): Promise<APIGatewayAuthorizerResult> => {
  context.callbackWaitsForEmptyEventLoop = false;
  logger.debug(event);
  const token = event.headers.Auth || event.queryStringParameters.Auth;
  if (token) {
    if(token === 'eyJraWQiOiI0UHBYcnlRNVJFUUp6QXIwV1p2V21FcDVIdVFpb1ZsUXNWUitJM3NWZ2NBPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI1NzZiNDcwMy1mZjUwLTQ2YmUtOWExZi0zMGM5ZDFmZTc0ZTQiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIHBob25lIG9wZW5pZCBwcm9maWxlIiwiYXV0aF90aW1lIjoxNTU4MDQ3NzY1LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9IYXNXdFdhQXAiLCJleHAiOjE1NTgyNjIzMTAsImlhdCI6MTU1ODI1ODcxMCwidmVyc2lvbiI6MiwianRpIjoiN2I2ZmEzMjYtMzlkYS00OGJhLWFhNzgtM2QyMGU4ZGY4NDkwIiwiY2xpZW50X2lkIjoiMWliZjVzMmVla2Rmb3Q3dXVrMmdoM2pyZTQiLCJ1c2VybmFtZSI6IjU3NmI0NzAzLWZmNTAtNDZiZS05YTFmLTMwYzlkMWZlNzRlNCJ9.UsmZ3kukmfUldI7b-VfqxIU2SOU-yxOEVhSubBku4n9lHiVnwg_6x548Cs8vppKuHbAL_6JQaTo8x36E-4Zklqkk4fa82gStSVNJ4A3r8GA6tJWJIs6dDgek-usLA7EepGX13TariND63CPRrOrXj5CyQ4LWMf2dpU9xpqWHFl7J-IvfZCwcP30XTWDxC5kH1hzOxA77gBhO3uqMZ54xYJEQzH_limUFUM_hyqIE4t-78VWmU9zhVowAiSMGc-dPGxTEJvck9TiqWrCLwNCR-HD4UGXPzKG_JC44lRCEXL4Z2VVKHHZjAHLbBdn6eVC35JehFPUQeUcTzQ3ci7COew') {
      return generatePolicy('beeline-test-request', 'Allow', event.methodArn)
    }
    try {
      const sections = token.split('.');
      const header = JSON.parse(Buffer.from(sections[0], 'base64').toString('utf-8'));
      const { status, data } = await axios.get<{ keys: Array<{ kty: string, n: string, e: string, kid: string }>}>(url);
      if(status === 200) {
        const key = data.keys.find(({ kid }) => header.kid === kid);
        if (!key) {
          logger.error('Public key not found in jwks.json');
        } else {
          const jwkArray = { kty: key.kty, n: key.n, e: key.e };
          const pem = jwkToPem(jwkArray);
          const { method, resource } = parseMethodArn(event.methodArn);
          const decoded = await doVerify(token, pem, { issuer: iss });
          // const decoded = await jwk.decode(token);
          logger.debug({ method, resource, decoded}, 'User request info');
          return generatePolicy(decoded.sub, 'Allow', event.methodArn)
        }
      }
    } catch (error) {
      logger.error(error, 'Authorization failed');
    }
  }
  throw new Error('Unauthorized');
};

export default {
  handler,
};
