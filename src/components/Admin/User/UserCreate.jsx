import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { graphqlQuery, graphqlMutation } from '../../../utils/graphqlClient';
import { listLegalApps } from '../../../graphql/queries';
import { createUser } from '../../../graphql/mutations';
import { IconArrowLeft, IconChevronDown } from '../icons/AdminIcons';

const UserCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', legalAppUsersId: '' });
  const [legalApps, setLegalApps] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingApps, setLoadingApps] = useState(true);

  const loadLegalApps = useCallback(async () => {
    try {
      const result = await graphqlQuery(listLegalApps);
      setLegalApps(result.data.listLegalApps.items);
    } catch (err) {
      console.error('Error loading legal apps:', err);
    } finally {
      setLoadingApps(false);
    }
  }, []);

  useEffect(() => {
    loadLegalApps();
  }, [loadLegalApps]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const input = { name: formData.name };
      if (formData.legalAppUsersId) {
        input.legalAppUsersId = formData.legalAppUsersId;
      }
      await graphqlMutation(createUser, { input });
      navigate('/admin/users');
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.message || 'No se pudo crear el usuario.');
      setLoading(false);
    }
  };

  if (loadingApps) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" role="status">
        <Spinner animation="border" />
        <span className="visually-hidden">Cargando…</span>
      </div>
    );
  }

  return (
    <div className="admin-form-page">
      <Link to="/admin/users" className="admin-back-link">
        <IconArrowLeft />
        Volver a usuarios
      </Link>

      <h1 className="admin-page-title">Nuevo usuario</h1>
      <p className="admin-page-desc">
        Asocia el usuario a una aplicación legal para mantener el contexto de permisos y datos.
      </p>

      {error ? <Alert variant="danger" className="mt-3">{error}</Alert> : null}

      <Form className="mt-4" onSubmit={handleSubmit} noValidate>
        <div className="admin-form-card">
          <div className="admin-form-card-body admin-form-control-like">
            <Form.Group className="mb-4" controlId="user-name">
              <Form.Label className="small fw-medium text-body-secondary">Nombre *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Nombre completo o identificador"
                autoComplete="name"
              />
            </Form.Group>

            <Form.Group className="mb-0" controlId="user-legal-app">
              <Form.Label className="small fw-medium text-body-secondary">Aplicación legal</Form.Label>
              <div className="position-relative">
                <Form.Select
                  name="legalAppUsersId"
                  value={formData.legalAppUsersId}
                  onChange={handleChange}
                  className="shadow-sm pe-5"
                  style={{ appearance: 'none', WebkitAppearance: 'none' }}
                  aria-label="Aplicación legal"
                >
                  <option value="">Sin asignar</option>
                  {legalApps.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.name}
                    </option>
                  ))}
                </Form.Select>
                <span
                  className="position-absolute top-50 end-0 translate-middle-y pe-3 text-secondary pointer-events-none"
                  aria-hidden="true"
                >
                  <IconChevronDown />
                </span>
              </div>
              <Form.Text className="text-muted">Opcional si aún no tienes la app creada.</Form.Text>
            </Form.Group>
          </div>

          <div className="admin-form-card-footer">
            <Button type="button" variant="outline-secondary" onClick={() => navigate('/admin/users')}>
              Cancelar
            </Button>
            <Button type="submit" variant="dark" className="shadow-sm" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" aria-hidden />
                  Creando…
                </>
              ) : (
                'Crear usuario'
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default UserCreate;
