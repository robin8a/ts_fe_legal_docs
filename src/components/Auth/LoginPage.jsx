import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { IconScale } from '../Admin/icons/AdminIcons';
import '../../styles/loginPage.css';

const LoginPage = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from || '/admin';

  useEffect(() => {
    document.title = 'Iniciar sesión · Legal Docs Admin';
  }, []);

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = login(username, password);
    if (!result.ok) {
      setError(result.message);
      setSubmitting(false);
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-banner" aria-hidden="true">
        <div className="login-banner-overlay" />
        <div className="login-banner-content">
          <span className="login-banner-mark">
            <IconScale size={28} />
          </span>
          <p className="login-banner-eyebrow">Legal Docs Admin</p>
          <h1 className="login-banner-title">Bienvenido a Legal Docs</h1>
          <p className="login-banner-copy">
            Inicia sesión para gestionar documentos, usuarios y el espacio de cumplimiento
            desde un solo lugar.
          </p>
        </div>
      </div>

      <div className="login-panel">
        <div className="login-panel-inner">
          <div className="login-panel-brand d-flex align-items-center gap-2 mb-4">
            <span className="login-panel-mark" aria-hidden="true">
              <IconScale size={20} />
            </span>
            <div>
              <div className="fw-bold">Legal Docs</div>
              <div className="text-muted small">Inicio de sesión</div>
            </div>
          </div>

          <h2 className="login-panel-heading">Inicia sesión</h2>
          <p className="login-panel-desc text-muted">
            Usa tu usuario de administrador para continuar.
          </p>

          {error ? (
            <Alert variant="danger" className="py-2 small" role="alert">
              {error}
            </Alert>
          ) : null}

          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3" controlId="login-username">
              <Form.Label className="small fw-medium">Usuario</Form.Label>
              <Form.Control
                type="text"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                required
                placeholder="administrador"
                aria-label="Usuario"
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="login-password">
              <Form.Label className="small fw-medium">Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                required
                placeholder="••••••••"
                aria-label="Contraseña"
              />
            </Form.Group>

            <Button
              type="submit"
              variant="dark"
              className="login-submit w-100 d-inline-flex align-items-center justify-content-center gap-2"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" aria-hidden />
                  Entrando…
                </>
              ) : (
                'Entrar al panel'
              )}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
