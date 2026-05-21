import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { graphqlQuery, graphqlMutation } from '../../../utils/graphqlClient';
import { getLegalApp, updateLegalApp } from '../../../graphql_custom';
import { IconArrowLeft } from '../icons/AdminIcons';

const LegalAppEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadLegalApp();
  }, [id]);

  const loadLegalApp = async () => {
    try {
      const result = await graphqlQuery(getLegalApp, { id });
      const app = result.data.getLegalApp;
      setFormData({ name: app.name || '' });
      setLoadingData(false);
    } catch (err) {
      console.error('Error loading legal app:', err);
      setError('Error loading legal app');
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await graphqlMutation(updateLegalApp, {
        input: { id, ...formData },
      });
      navigate('/admin/legal-apps');
    } catch (err) {
      console.error('Error updating legal app:', err);
      setError('Error updating legal app: ' + (err.message || 'Unknown error'));
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" role="status">
        <Spinner animation="border" />
        <span className="visually-hidden">Cargando…</span>
      </div>
    );
  }

  return (
    <div className="admin-form-page">
      <Link to="/admin/legal-apps" className="admin-back-link">
        <IconArrowLeft />
        Volver a aplicaciones legales
      </Link>

      <h1 className="admin-page-title">Editar aplicación legal</h1>
      <p className="admin-page-desc">Actualiza el nombre del espacio de trabajo.</p>

      {error ? <Alert variant="danger" className="mt-3">{error}</Alert> : null}

      <Form className="mt-4" onSubmit={handleSubmit} noValidate>
        <div className="admin-form-card">
          <div className="admin-form-card-body admin-form-control-like">
            <Form.Group className="mb-0" controlId="legal-app-name">
              <Form.Label className="small fw-medium text-body-secondary">Nombre *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Nombre de la aplicación"
              />
            </Form.Group>
          </div>

          <div className="admin-form-card-footer">
            <Button type="button" variant="outline-secondary" onClick={() => navigate('/admin/legal-apps')}>
              Cancelar
            </Button>
            <Button type="submit" variant="dark" className="shadow-sm" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" aria-hidden />
                  Guardando…
                </>
              ) : (
                'Guardar cambios'
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default LegalAppEdit;
