import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { graphqlQuery, graphqlQueryList, graphqlMutation } from '../../../utils/graphqlClient';
import {
  getLegalDocRecord,
  listUserLegalApps,
  listLegalDocs,
  updateLegalDocRecord,
} from '../../../graphql_custom';
import { IconArrowLeft, IconChevronDown } from '../icons/AdminIcons';
import { shortId } from '../../../utils/adminListFormat';

const userLegalAppLabel = (item) => {
  const userName = item.user?.name ?? shortId(item.userUserLegalAppsId);
  const appName = item.legalApp?.name ?? shortId(item.legalAppUserLegalAppsId);
  return `${userName} — ${appName}`;
};

const LegalDocRecordEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sign: '',
    legalSignDate: Math.floor(Date.now() / 1000),
    userLegalAppLegalDocRecordsId: '',
    legalDocLegalDocRecordsId: '',
  });
  const [userLegalApps, setUserLegalApps] = useState([]);
  const [legalDocs, setLegalDocs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadRecord();
    loadReferences();
  }, [id]);

  const loadRecord = async () => {
    try {
      const result = await graphqlQuery(getLegalDocRecord, { id });
      const record = result.data.getLegalDocRecord;
      setFormData({
        sign: record.sign || '',
        legalSignDate: record.legalSignDate || Math.floor(Date.now() / 1000),
        userLegalAppLegalDocRecordsId: record.userLegalAppLegalDocRecordsId || '',
        legalDocLegalDocRecordsId: record.legalDocLegalDocRecordsId || '',
      });
      setLoadingData(false);
    } catch (err) {
      console.error('Error loading record:', err);
      setError('Error loading record');
      setLoadingData(false);
    }
  };

  const loadReferences = async () => {
    try {
      const [ulaResult, docsResult] = await Promise.all([
        graphqlQueryList(listUserLegalApps, 'listUserLegalApps'),
        graphqlQueryList(listLegalDocs, 'listLegalDocs'),
      ]);
      setUserLegalApps(ulaResult.items);
      setLegalDocs(docsResult.items);
      if (ulaResult.warning || docsResult.warning) {
        console.warn('Some reference lists loaded with incomplete rows');
      }
    } catch (err) {
      console.error('Error loading references:', err);
    }
  };

  const selectedDoc = useMemo(
    () => legalDocs.find((d) => d.id === formData.legalDocLegalDocRecordsId),
    [legalDocs, formData.legalDocLegalDocRecordsId],
  );

  const docLegalAppId =
    selectedDoc?.legalApp?.id ?? selectedDoc?.legalAppLegalDocsId ?? null;

  const filteredUserLegalApps = useMemo(() => {
    if (!docLegalAppId) return userLegalApps;
    return userLegalApps.filter(
      (item) =>
        item.legalApp?.id === docLegalAppId ||
        item.legalAppUserLegalAppsId === docLegalAppId,
    );
  }, [userLegalApps, docLegalAppId]);

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'legalSignDate') {
      const date = new Date(e.target.value);
      value = Number.isNaN(date.getTime()) ? formData.legalSignDate : Math.floor(date.getTime() / 1000);
    }

    if (e.target.name === 'legalDocLegalDocRecordsId') {
      const nextDoc = legalDocs.find((d) => d.id === value);
      const nextAppId = nextDoc?.legalApp?.id ?? nextDoc?.legalAppLegalDocsId ?? null;
      const currentUla = userLegalApps.find(
        (item) => item.id === formData.userLegalAppLegalDocRecordsId,
      );
      const currentAppId =
        currentUla?.legalApp?.id ?? currentUla?.legalAppUserLegalAppsId ?? null;
      const ulaStillValid =
        !nextAppId || !currentUla || currentAppId === nextAppId;

      setFormData({
        ...formData,
        legalDocLegalDocRecordsId: value,
        userLegalAppLegalDocRecordsId: ulaStillValid
          ? formData.userLegalAppLegalDocRecordsId
          : '',
      });
      setError('');
      return;
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
        id,
        sign: formData.sign,
        legalSignDate: parseInt(String(formData.legalSignDate), 10),
      };
      if (formData.userLegalAppLegalDocRecordsId) {
        input.userLegalAppLegalDocRecordsId = formData.userLegalAppLegalDocRecordsId;
      }
      if (formData.legalDocLegalDocRecordsId) {
        input.legalDocLegalDocRecordsId = formData.legalDocLegalDocRecordsId;
      }

      await graphqlMutation(updateLegalDocRecord, { input });
      navigate('/admin/legal-doc-records');
    } catch (err) {
      console.error('Error updating record:', err);
      setError('Error updating record: ' + (err.message || 'Unknown error'));
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

  const dateValue = new Date(formData.legalSignDate * 1000).toISOString().slice(0, 16);

  return (
    <div className="admin-form-page">
      <Link to="/admin/legal-doc-records" className="admin-back-link">
        <IconArrowLeft />
        Volver a registros
      </Link>

      <h1 className="admin-page-title">Editar registro de documento</h1>
      <p className="admin-page-desc">
        Actualiza la firma, fecha y vínculos con usuario en aplicación y documento legal.
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

            <Form.Group className="mb-4" controlId="record-doc">
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
                      {doc.version}
                      {doc.legalApp?.name ? ` (${doc.legalApp.name})` : ''}
                      {' — '}
                      {shortId(doc.id)}
                    </option>
                  ))}
                </Form.Select>
                <span
                  className="position-absolute top-50 end-0 translate-middle-y pe-3 text-secondary pe-none"
                  aria-hidden="true"
                >
                  <IconChevronDown />
                </span>
              </div>
              {selectedDoc && !docLegalAppId ? (
                <Form.Text className="text-warning">
                  Este documento no tiene app legal asignada; se muestran todos los vínculos usuario–app.
                </Form.Text>
              ) : null}
            </Form.Group>

            <Form.Group className="mb-0" controlId="record-user-legal-app">
              <Form.Label className="small fw-medium text-body-secondary">Usuario en aplicación</Form.Label>
              <div className="position-relative">
                <Form.Select
                  name="userLegalAppLegalDocRecordsId"
                  value={formData.userLegalAppLegalDocRecordsId}
                  onChange={handleChange}
                  className="shadow-sm pe-5"
                  style={{ appearance: 'none', WebkitAppearance: 'none' }}
                  aria-label="Usuario en aplicación"
                  disabled={Boolean(docLegalAppId && filteredUserLegalApps.length === 0)}
                >
                  <option value="">Sin asignar</option>
                  {filteredUserLegalApps.map((item) => (
                    <option key={item.id} value={item.id}>
                      {userLegalAppLabel(item)}
                    </option>
                  ))}
                </Form.Select>
                <span
                  className="position-absolute top-50 end-0 translate-middle-y pe-3 text-secondary pe-none"
                  aria-hidden="true"
                >
                  <IconChevronDown />
                </span>
              </div>
              {docLegalAppId && filteredUserLegalApps.length === 0 ? (
                <Form.Text className="text-muted">
                  No hay usuarios vinculados a la app «{selectedDoc?.legalApp?.name}». Asígnalos en Usuarios.
                </Form.Text>
              ) : docLegalAppId ? (
                <Form.Text className="text-muted">
                  Solo vínculos de la app «{selectedDoc?.legalApp?.name ?? 'seleccionada'}».
                </Form.Text>
              ) : null}
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

export default LegalDocRecordEdit;
