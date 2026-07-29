/**
 * Credenciales hardcodeadas del único administrador del panel.
 * Cambia aquí los valores cuando lo necesites (solo para pruebas / acceso local).
 * No uses esto para producción real: la contraseña queda visible en el front.
 */
export const HARDCODED_ADMIN = {
  username: 'administrador',
  password: 'terrasacha2026',
  displayName: 'Administrador',
  email: 'admin@legaldocs.io',
};

export const AUTH_STORAGE_KEY = 'legal-docs-admin-session';

export const validateAdminCredentials = (username, password) => {
  const u = String(username || '').trim();
  const p = String(password || '');
  return u === HARDCODED_ADMIN.username && p === HARDCODED_ADMIN.password;
};
