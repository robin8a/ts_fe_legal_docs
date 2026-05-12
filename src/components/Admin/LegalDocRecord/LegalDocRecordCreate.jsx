import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { graphqlQuery, graphqlMutation } from '../../../utils/graphqlClient';
import { listUsers, listLegalDocs } from '../../../graphql/queries';
import { createLegalDocRecord } from '../../../graphql/mutations';
import { IconArrowLeft, IconChevronDown } from '../icons/AdminIcons';
import { shortId } from '../../../utils/adminListFormat';

const LegalDocRecordCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sign: '',
    legalSignDate: Math.floor(Date.now() / 1000),
    userLegalDocRecordsId: '',
    legalDocLegalDocRecordsId: '',
  });
  const [users, setUsers] = useState([]);
  const [legalDocs, setLegalDocs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingRefs, setLoadingRefs] = useState(true);

  const loadReferences = useCallback(async () => {
    try {
      const [usersResult, docsResult] = await Promise.all([
        graphqlQuery(listUsers),
        graphqlQuery(listLegalDocs),
      ]);
      setUsers(usersResult.data.listUsers.items);
      setLegalDocs(docsResult.data.listLegalDocs.items);
    } catch (err) {
      console.error('Error loading references:', err);
    } finally {
      setLoadingRefs(false);
    }
  }, []);

  useEffect(() => {
    loadReferences();
  }, [loadReferences]);

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'legalSignDate') {
      const date = new Date(e.target.value);
      value = Number.isNaN(date.getTime()) ? formData.legalSignDate : Math.floor(date.getTime() / 1000);
    }
    setFormData({ ...formData, [e.target.name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const input = {
        sign: formData.sign,
        legalSignDate: parseInt(String(formData.legalSignDate), 10),
      };
      if (formData.userLegalDocRecordsId) {
        input.userLegalDocRecordsId = formData.userLegalDocRecordsId;
      }
      if (formData.legalDocLegalDocRecordsId) {
        input.legalDocLegalDocRecordsId = formData.legalDocLegalDocRecordsId;
      }
      await graphqlMutation(createLegalDocRecord, { input });
      navigate('/admin/legal-doc-records');
    } catch (err) {
      console.error('Error creating record:', err);
      setError(err.message || 'No se pudo crear el registro.');
      setLoading(false);
    }
  };

  if (loadingRefs) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" role="status">
        <Spinner animation="border" />
        <span className="visually-hidden">Cargando…</span>
      </div>
    );
  }

  const dateValue = new Date(formData.legalSignDate * 1000).toISOString().slice(0, 16);

  return (
    <div className="admin-form-page">
      <Link to="/admin/legal-doc-records" className="admin-back-link">
        <IconArrowLeft />
        Volver a registros
      </Link>

      <h1 className="admin-page-title">Nuevo registro de documento</h1>
      <p className="admin-page-desc">
        Vincula una firma con la fecha legal, el usuario y la versión del documento firmado.
      </p>

      {error ? <Alert variant="danger" className="mt-3">{error}</Alert> : null}

      <Form className="mt-4" onSubmit={handleSubmit} noValidate>
        <div className="admin-form-card">
          <div className="admin-form-card-body admin-form-control-like">
            <Form.Group className="mb-4" controlId="record-sign">
              <Form.Label className="small fw-medium text-body-secondary">Firma / identificador *</Form.Label>
              <Form.Control
                type="text"
                name="sign"
                value={formData.sign}
                onChange={handleChange}
                required
                placeholder="Referencia o hash de firma"
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="record-date">
              <Form.Label className="small fw-medium text-body-secondary">Fecha y hora legal *</Form.Label>
              <Form.Control
                type="datetime-local"
                name="legalSignDate"
                value={dateValue}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="record-user">
              <Form.Label className="small fw-medium text-body-secondary">Usuario</Form.Label>
              <div className="position-relative">
                <Form.Select
                  name="userLegalDocRecordsId"
                  value={formData.userLegalDocRecordsId}
                  onChange={handleChange}
                  className="shadow-sm pe-5"
                  style={{ appearance: 'none', WebkitAppearance: 'none' }}
                  aria-label="Usuario"
                >
                  <option value="">Sin asignar</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
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
            </Form.Group>

            <Form.Group className="mb-0" controlId="record-doc">
              <Form.Label className="small fw-medium text-body-secondary">Documento legal</Form.Label>
              <div className="position-relative">
                <Form.Select
                  name="legalDocLegalDocRecordsId"
                  value={formData.legalDocLegalDocRecordsId}
                  onChange={handleChange}
                  className="shadow-sm pe-5"
                  style={{ appearance: 'none', WebkitAppearance: 'none' }}
                  aria-label="Documento"
                >
                  <option value="">Sin asignar</option>
                  {legalDocs.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.version} — {shortId(doc.id)}
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
            </Form.Group>
          </div>

          <div className="admin-form-card-footer">
            <Button type="button" variant="outline-secondary" onClick={() => navigate('/admin/legal-doc-records')}>
              Cancelar
            </Button>
            <Button type="submit" variant="dark" className="shadow-sm" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" aria-hidden />
                  Creando…
                </>
              ) : (
                'Crear registro'
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default LegalDocRecordCreate;
