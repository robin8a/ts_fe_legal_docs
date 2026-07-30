/**
 * Cognito desactivado temporalmente.
 * El panel usa login hardcodeado en src/auth/adminCredentials.js.
 *
 * Para reactivar Cognito más adelante, sustituye este archivo por
 * `defineAuth` o un `referenceAuth` con un User Pool que exista en la cuenta,
 * e incluye `auth` en amplify/backend.ts.
 *
 * Ejemplo (User Pool nuevo):
 *
 *   import { defineAuth } from '@aws-amplify/backend';
 *   export const auth = defineAuth({
 *     loginWith: { email: true },
 *   });
 */

export {};
