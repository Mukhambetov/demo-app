const { readFileSync } = require('fs');
const { resolve } = require('path');

module.exports = async (serverless) => {
  const stage = await serverless.resolveVariable('self:custom.stage');
  const context = await serverless.resolveVariable('self:custom.context');
  const domain = await serverless.resolveVariable('self:custom.domain');
  const subDomain = null; // await serverless.resolveVariable('self:custom.subDomain');
  const account = await serverless.resolveVariable('aws:accountId');
  // const verifyCode = readFileSync(resolve(__dirname, './verify-code.html')).toString();
  // const tempPassword = readFileSync(resolve(__dirname, './temp-password.html')).toString();
  return {
    account,
    prefix: context + (stage !== 'prod' ? `-${stage}` : ''),
    host: `${subDomain ? `${subDomain + (stage !== 'prod' ? `-${stage}` : '')}.` : ''}${domain}`,
    api: `api${stage !== 'prod' ? `-${stage}` : ''}.${domain}`,
    // verifyCode,
    // tempPassword,
  };
};
