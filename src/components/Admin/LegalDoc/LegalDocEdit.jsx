import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { graphqlQuery, graphqlMutation, graphqlQueryList } from '../../../utils/graphqlClient';
import {
  getLegalDoc,
  listLegalDocTypes,
  listLegalDocs,
  listLegalApps,
  listUsers,
  updateLegalDoc,
} from '../../../graphql_custom';
import { IconArrowLeft, IconChevronDown } from '../icons/AdminIcons';

const LegalDocEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    version: '',
    isActive: true,
    is_latest: true,
    url: '',
    legalDocTypeLegalDocsId: '',
    legalDocLegalDocChildrenId: '',
    legalAppLegalDocsId: '',
    userLegalDocsId: '',
  });
  const [docTypes, setDocTypes] = useState([]);
  const [parentDocs, setParentDocs] = useState([]);
  const [legalApps, setLegalApps] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadLegalDoc();
    loadReferences();
  }, [id]);

  const loadLegalDoc = async () => {
    try {
      const result = await graphqlQuery(getLegalDoc, { id });
      const doc = result.data.getLegalDoc;
      setFormData({
        version: doc.version || '',
        isActive: doc.isActive !== undefined ? doc.isActive : true,
        is_latest: doc.is_latest !== undefined ? doc.is_latest : true,
        url: doc.url || '',
        legalDocTypeLegalDocsId: doc.legalDocTypeLegalDocsId || '',
        legalDocLegalDocChildrenId: doc.legalDocLegalDocChildrenId || '',
        legalAppLegalDocsId: doc.legalAppLegalDocsId || doc.legalApp?.id || '',
        userLegalDocsId: doc.userLegalDocsId || doc.author?.id || '',
      });
      setLoadingData(false);
    } catch (err) {
      console.error('Error loading legal doc:', err);
      setError('Error loading legal document');
      setLoadingData(false);
    }
  };

  const loadReferences = async () => {
    try {
      const [docTypesResult, docsResult, appsResult, usersResult] = await Promise.all([
        graphqlQueryList(listLegalDocTypes, 'listLegalDocTypes'),
        graphqlQueryList(listLegalDocs, 'listLegalDocs'),
        graphqlQueryList(listLegalApps, 'listLegalApps'),
        graphqlQueryList(listUsers, 'listUsers'),
      ]);
      setDocTypes(docTypesResult.items);
      setParentDocs(docsResult.items);
      setLegalApps(appsResult.items);
      setUsers(usersResult.items);
      const warnings = [docTypesResult, docsResult, appsResult, usersResult]
        .map((r) => r.warning)
        .filter(Boolean);
      if (warnings.length) {
        console.warn('Some reference lists loaded with incomplete rows:', warnings.join('; '));
      }
    } catch (err) {
      console.error('Error loading references:', err);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const input = {
        id,
        version: formData.version,
        isActive: formData.isActive,
        is_latest: formData.is_latest,
        url: formData.url,
      };
      if (formData.legalDocTypeLegalDocsId) {
        input.legalDocTypeLegalDocsId = formData.legalDocTypeLegalDocsId;
      }
      if (formData.legalDocLegalDocChildrenId) {
        input.legalDocLegalDocChildrenId = formData.legalDocLegalDocChildrenId;
      }
      if (formData.legalAppLegalDocsId) {
        input.legalAppLegalDocsId = formData.legalAppLegalDocsId;
      }
      if (formData.userLegalDocsId) {
        input.userLegalDocsId = formData.userLegalDocsId;
      }

      await graphqlMutation(updateLegalDoc, { input });
      navigate('/admin/legal-docs');
    } catch (err) {
      console.error('Error updating legal doc:', err);
      setError('Error updating legal document: ' + (err.message || 'Unknown error'));
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" role="status">
        <Spinner animation="border" />
        <span className="visually-hidden">Loading…</span>
      </div>
    );
  }

  return (
    <div className="admin-form-page">
      <Link to="/admin/legal-docs" className="admin-back-link">
        <IconArrowLeft />
        Back to Legal Docs
      </Link>

      <h1 className="admin-page-title">Edit Legal Document</h1>
      <p className="admin-page-desc">Update version, status, URL, and relationships.</p>

      {error ? <Alert variant="danger" className="mt-3">{error}</Alert> : null}

      <Form className="mt-4" onSubmit={handleSubmit} noValidate>
        <div className="admin-form-card">
          <div className="admin-form-card-body">
            <Row className="g-4 mb-4">
              <Col md={6}>
                <Form.Group controlId="legal-doc-version">
                  <Form.Label className="small fw-medium text-body-secondary">Version Name</Form.Label>
                  <Form.Control
                    className="shadow-sm"
                    type="text"
                    name="version"
                    value={formData.version}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Terms of Service v1.0"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="legal-doc-type">
                  <Form.Label className="small fw-medium text-body-secondary">Document Type</Form.Label>
                  <div className="position-relative">
                    <Form.Select
                      name="legalDocTypeLegalDocsId"
                      value={formData.legalDocTypeLegalDocsId}
                      onChange={handleChange}
                      required
                      className="shadow-sm pe-5"
                      style={{ appearance: 'none', WebkitAppearance: 'none' }}
                    >
                      <option value="">Select type…</option>
                      {docTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
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
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-4 mb-4">
              <Col md={6}>
                <Form.Group controlId="legal-doc-app-edit">
                  <div className="admin-form-label-row mb-2">
                    <Form.Label className="small fw-medium text-body-secondary mb-0">Legal App</Form.Label>
                    <span className="text-muted small fw-normal">Owner workspace</span>
                  </div>
                  <div className="position-relative">
                    <Form.Select
                      name="legalAppLegalDocsId"
                      value={formData.legalAppLegalDocsId}
                      onChange={handleChange}
                      className="shadow-sm pe-5"
                      style={{ appearance: 'none', WebkitAppearance: 'none' }}
                      aria-label="Legal App owning this document"
                    >
                      <option value="">Unassigned</option>
                      {legalApps.map((app) => (
                        <option key={app.id} value={app.id}>
                          {app.name}
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
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="legal-doc-author-edit">
                  <div className="admin-form-label-row mb-2">
                    <Form.Label className="small fw-medium text-body-secondary mb-0">Author</Form.Label>
                    <span className="text-muted small fw-normal">Optional</span>
                  </div>
                  <div className="position-relative">
                    <Form.Select
                      name="userLegalDocsId"
                      value={formData.userLegalDocsId}
                      onChange={handleChange}
                      className="shadow-sm pe-5"
                      style={{ appearance: 'none', WebkitAppearance: 'none' }}
                      aria-label="Document author"
                    >
                      <option value="">No author</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
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
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4" controlId="legal-doc-url">
              <Form.Label className="small fw-medium text-body-secondary">Document URL</Form.Label>
              <Form.Control
                className="shadow-sm"
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                required
                placeholder="https://example.com/document.pdf"
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="legal-doc-parent">
              <Form.Label className="small fw-medium text-body-secondary">Parent Document</Form.Label>
              <Form.Select
                name="legalDocLegalDocChildrenId"
                value={formData.legalDocLegalDocChildrenId}
                onChange={handleChange}
                className="shadow-sm"
              >
                <option value="">None</option>
                {parentDocs
                  .filter((doc) => doc.id !== id)
                  .map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.version} — {doc.id}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>

            <div className="admin-active-row">
              <Form.Check
                type="checkbox"
                name="isActive"
                id="legal-doc-active-edit"
                checked={formData.isActive}
                onChange={handleChange}
                label={
                  <span>
                    <span className="small fw-medium text-body-secondary d-block mb-1">Set as Active Document</span>
                    <span className="text-muted small d-block">
                      Marking this as active will supersede any previous versions of this type.
                    </span>
                  </span>
                }
              />
            </div>

            <div className="admin-active-row mt-3">
              <Form.Check
                type="checkbox"
                name="is_latest"
                id="legal-doc-latest-edit"
                checked={formData.is_latest}
                onChange={handleChange}
                label={
                  <span>
                    <span className="small fw-medium text-body-secondary d-block mb-1">Mark as latest version</span>
                    <span className="text-muted small d-block">
                      Only one version per document type should typically be the latest.
                    </span>
                  </span>
                }
              />
            </div>
          </div>

          <div className="admin-form-card-footer">
            <Button type="button" variant="outline-secondary" onClick={() => navigate('/admin/legal-docs')}>
              Cancel
            </Button>
            <Button type="submit" variant="dark" className="shadow-sm" disabled={loading}>
              {loading ? 'Updating…' : 'Update Document'}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default LegalDocEdit;
