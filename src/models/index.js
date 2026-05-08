// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { LegalApp, User, LegalDocType, LegalDoc, LegalDocRecord } = initSchema(schema);

export {
  LegalApp,
  User,
  LegalDocType,
  LegalDoc,
  LegalDocRecord
};