import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { graphqlQuery, graphqlMutation } from '../../../utils/graphqlClient';
import { listLegalApps, createUser, createUserLegalApp } from '../../../graphql_custom';
import { IconArrowLeft } from '../icons/AdminIcons';

const UserCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', legalAppIds: [] });
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

  const handleLegalAppToggle = (legalAppId) => {
    setFormData((prev) => {
      const ids = prev.legalAppIds.includes(legalAppId)
        ? prev.legalAppIds.filter((id) => id !== legalAppId)
        : [...prev.legalAppIds, legalAppId];
      return { ...prev, legalAppIds: ids };
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await graphqlMutation(createUser, { input: { name: formData.name } });
      const newUser = result.data.createUser;

      if (formData.legalAppIds.length > 0) {
        await Promise.all(
          formData.legalAppIds.map((legalAppId) =>
            graphqlMutation(createUserLegalApp, {
              input: {
                userUserLegalAppsId: newUser.id,
                legalAppUserLegalAppsId: legalAppId,
              },
            }),
          ),
        );
      }

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
        Crea el usuario y selecciona las aplicaciones legales a las que tendrá acceso.
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

            <Form.Group className="mb-0" controlId="user-legal-apps">
              <Form.Label className="small fw-medium text-body-secondary">Aplicaciones legales</Form.Label>
              {legalApps.length > 0 ? (
                <div className="d-flex flex-column gap-2 mt-2">
                  {legalApps.map((app) => (
                    <Form.Check
                      key={app.id}
                      type="checkbox"
                      id={`legal-app-${app.id}`}
                      label={app.name}
                      checked={formData.legalAppIds.includes(app.id)}
                      onChange={() => handleLegalAppToggle(app.id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted small mb-0">
                  No hay aplicaciones legales. Crea una en Legal Apps antes de asignar usuarios.
                </p>
              )}
              <Form.Text className="text-muted">
                Puedes asignar varias apps; cada combinación usuario–app es un vínculo independiente.
              </Form.Text>
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
