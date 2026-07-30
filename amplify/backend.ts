import { defineBackend } from '@aws-amplify/backend';
import { Tags } from 'aws-cdk-lib';
import { data } from './data/resource';

/**
 * Gen 2 backend sin Cognito por ahora.
 * El acceso al panel se controla en el front (login hardcodeado).
 * AppSync usa API Key (authorizationModes en data/resource.ts).
 *
 * Cuando quieras Cognito real, vuelve a importar auth y añádelo aquí:
 *   import { auth } from './auth/resource';
 *   defineBackend({ data, auth });
 */
const backend = defineBackend({
  data,
});

export type Backend = typeof backend;

export function postRefactor() {
  Tags.of(backend.stack).add('gen2-migration/post-refactor', 'true');
}

// Uncomment after refactor
// postRefactor();
