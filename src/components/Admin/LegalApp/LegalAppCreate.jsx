import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { graphqlMutation } from '../../../utils/graphqlClient';
import { createLegalApp } from '../../../graphql_custom';
import { IconArrowLeft } from '../icons/AdminIcons';

const LegalAppCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await graphqlMutation(createLegalApp, { input: formData });
      navigate('/admin/legal-apps');
    } catch (err) {
      console.error('Error creating legal app:', err);
      setError(err.message || 'No se pudo crear la aplicación.');
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-page">
      <Link to="/admin/legal-apps" className="admin-back-link">
        <IconArrowLeft />
        Volver a aplicaciones legales
      </Link>

      <h1 className="admin-page-title">Nueva aplicación legal</h1>
      <p className="admin-page-desc">
        Registra un espacio de trabajo para agrupar usuarios, documentos y registros de firma.
      </p>

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
                placeholder="Ej. App cumplimiento 2025"
                autoComplete="organization"
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
                  Creando…
                </>
              ) : (
                'Crear aplicación'
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default LegalAppCreate;
