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

/** Tablas DynamoDB creadas por Amplify Gen 1 (env dev, API ilii2yazv5aexgliknt4oyf3yu). */
const gen1DevModelTables = {
  LegalApp: 'LegalApp-ilii2yazv5aexgliknt4oyf3yu-dev',
  User: 'User-ilii2yazv5aexgliknt4oyf3yu-dev',
  UserLegalApp: 'UserLegalApp-ilii2yazv5aexgliknt4oyf3yu-dev',
  LegalDocType: 'LegalDocType-ilii2yazv5aexgliknt4oyf3yu-dev',
  LegalDoc: 'LegalDoc-ilii2yazv5aexgliknt4oyf3yu-dev',
  LegalDocRecord: 'LegalDocRecord-ilii2yazv5aexgliknt4oyf3yu-dev',
} as const;

/**
 * branchName = nombre de la rama en Amplify Hosting ($AWS_BRANCH), NO el env Gen 1 "dev".
 * Repo conectado a rama Git/Hosting: main
 */
const hostingBranchesUsingGen1Tables = ['main'] as const;

export const data = defineData({
  name: 'tsbelegaldocsapi-dev-2',
  migratedAmplifyGen1DynamoDbTableMappings: hostingBranchesUsingGen1Tables.map(
    (branchName) => ({
      branchName,
      modelNameToTableNameMapping: { ...gen1DevModelTables },
    })
  ),
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 7 },
  },
  schema,
});
