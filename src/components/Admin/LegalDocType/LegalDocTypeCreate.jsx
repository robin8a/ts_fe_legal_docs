import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { graphqlMutation } from '../../../utils/graphqlClient';
import { createLegalDocType } from '../../../graphql_custom';
import { IconArrowLeft } from '../icons/AdminIcons';

const LegalDocTypeCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    description: '',
  });
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
      const input = { name: formData.name };
      if (formData.shortName) input.shortName = formData.shortName;
      if (formData.description) input.description = formData.description;
      await graphqlMutation(createLegalDocType, { input });
      navigate('/admin/legal-doc-types');
    } catch (err) {
      console.error('Error creating doc type:', err);
      setError(err.message || 'No se pudo crear el tipo de documento.');
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-page">
      <Link to="/admin/legal-doc-types" className="admin-back-link">
        <IconArrowLeft />
        Volver a tipos de documento
      </Link>

      <h1 className="admin-page-title">Nuevo tipo de documento</h1>
      <p className="admin-page-desc">
        Define una categoría (contrato, política, aviso legal…) para clasificar versiones de documentos.
      </p>

      {error ? <Alert variant="danger" className="mt-3">{error}</Alert> : null}

      <Form className="mt-4" onSubmit={handleSubmit} noValidate>
        <div className="admin-form-card">
          <div className="admin-form-card-body admin-form-control-like">
            <Form.Group className="mb-4" controlId="doc-type-name">
              <Form.Label className="small fw-medium text-body-secondary">Nombre *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ej. Términos de servicio"
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="doc-type-short">
              <div className="admin-form-label-row mb-2">
                <Form.Label className="small fw-medium text-body-secondary mb-0">Nombre corto</Form.Label>
                <span className="text-muted small fw-normal">Opcional</span>
              </div>
              <Form.Control
                type="text"
                name="shortName"
                value={formData.shortName}
                onChange={handleChange}
                placeholder="Ej. TOS"
              />
            </Form.Group>

            <Form.Group className="mb-0" controlId="doc-type-desc">
              <div className="admin-form-label-row mb-2">
                <Form.Label className="small fw-medium text-body-secondary mb-0">Descripción</Form.Label>
                <span className="text-muted small fw-normal">Opcional</span>
              </div>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Uso interno o notas para el equipo."
              />
            </Form.Group>
          </div>

          <div className="admin-form-card-footer">
            <Button type="button" variant="outline-secondary" onClick={() => navigate('/admin/legal-doc-types')}>
              Cancelar
            </Button>
            <Button type="submit" variant="dark" className="shadow-sm" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" aria-hidden />
                  Creando…
                </>
              ) : (
                'Crear tipo'
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default LegalDocTypeCreate;
