import { referenceAuth } from '@aws-amplify/backend';

export const auth = referenceAuth({
  userPoolId: 'us-east-1_chqNtZEAP',
  identityPoolId: 'us-east-1:07a6df03-fc6e-4f45-b979-b84f17b27fc6',
  authRoleArn:
    'arn:aws:iam::879381245127:role/amplify-tsbeoraculoapi-dev-755cb-authRole',
  unauthRoleArn:
    'arn:aws:iam::879381245127:role/amplify-tsbeoraculoapi-dev-755cb-unauthRole',
  userPoolClientId: '5gu39h1sr0hbcsj4krd9sti5cn',
});
