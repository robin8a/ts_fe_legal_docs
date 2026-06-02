import { defineData } from '@aws-amplify/backend';
import type { Backend } from '../backend';

const schema = `# This "input" configures a global authorization rule to enable public access to
# all models in this schema. Learn more about authorization rules here: https://docs.amplify.aws/cli/graphql/authorization-rules
input AMPLIFY { globalAuthRule: AuthRule = { allow: public } } # FOR TESTING ONLY!

type LegalApp @model @auth(rules: [{ allow: public }]) {
  id: ID! # Must be descriptive Ex. TS_ORACULO
  name: String!
  userLegalApps: [UserLegalApp] @hasMany
  legalDocs: [LegalDoc] @hasMany
}

type User @model @auth(rules: [{ allow: public }]) {
  id: ID! # Is the same on Cognito sub-id
  name: String!
  userLegalApps: [UserLegalApp] @hasMany
  legalDocRecords: [LegalDocRecord] @hasMany
  legalDocs: [LegalDoc] @hasMany
}

type UserLegalApp @model @auth(rules: [{ allow: public }]) {
  id: ID!
  user: User @belongsTo
  legalApp: LegalApp @belongsTo
  legalDocRecords: [LegalDocRecord] @hasMany
}

type LegalDocType @model @auth(rules: [{ allow: public }]) {
  id: ID!
  name: String!
  shortName: String
  description: String
  legalDocs: [LegalDoc] @hasMany
}

type LegalDoc @model @auth(rules: [{ allow: public }]) {
  id: ID!
  version: String!
  isActive: Boolean!
  is_latest: Boolean!
  url: AWSURL!
  legalDocParentID: LegalDoc @belongsTo
  legalDocChildren: [LegalDoc] @hasMany
  legalDocType: LegalDocType! @belongsTo
  legalDocRecords: [LegalDocRecord] @hasMany
  legalApp: LegalApp @belongsTo
  author: User @belongsTo
}

type LegalDocRecord @model @auth(rules: [{ allow: public }]) {
  id: ID!
  sign: String!
  legalSignDate: AWSTimestamp!
  userLegalApp: UserLegalApp @belongsTo
  legalDoc: LegalDoc @belongsTo
}
`;

export const data = defineData({
  migratedAmplifyGen1DynamoDbTableMappings: [
    {
      //The "branchName" variable needs to be the same as your deployment branch if you want to reuse your Gen1 app tables
      branchName: 'dev',
      modelNameToTableNameMapping: {
        LegalApp: 'LegalApp-ilii2yazv5aexgliknt4oyf3yu-dev',
        User: 'User-ilii2yazv5aexgliknt4oyf3yu-dev',
        UserLegalApp: 'UserLegalApp-ilii2yazv5aexgliknt4oyf3yu-dev',
        LegalDocType: 'LegalDocType-ilii2yazv5aexgliknt4oyf3yu-dev',
        LegalDoc: 'LegalDoc-ilii2yazv5aexgliknt4oyf3yu-dev',
        LegalDocRecord: 'LegalDocRecord-ilii2yazv5aexgliknt4oyf3yu-dev',
      },
    },
  ],
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 7 },
  },
  schema,
});
