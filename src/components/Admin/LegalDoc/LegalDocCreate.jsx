import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col, InputGroup, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { graphqlQuery, graphqlMutation, settledListItems } from '../../../utils/graphqlClient';
import {
  listLegalDocTypes,
  listLegalDocs,
  listLegalApps,
  listUsers,
  createLegalDoc,
} from '../../../graphql_custom';
import { IconArrowLeft, IconChevronDown, IconSearch, IconTrash } from '../icons/AdminIcons';

const buildUrlFromSuffix = (suffix) => {
  const trimmed = (suffix || '').trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, '')}`;
};

const urlSuffixFromFull = (full) => {
  if (!full) return '';
  return full.replace(/^https?:\/\//i, '');
};

const LegalDocCreate = () => {
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
  const [loadingRefs, setLoadingRefs] = useState(true);

  useEffect(() => {
    loadReferences();
  }, []);

  const loadReferences = async () => {
    const [docTypesResult, docsResult, appsResult, usersResult] = await Promise.allSettled([
      graphqlQuery(listLegalDocTypes),
      graphqlQuery(listLegalDocs),
      graphqlQuery(listLegalApps),
      graphqlQuery(listUsers),
    ]);

    const docTypes = settledListItems(docTypesResult, 'listLegalDocTypes');
    const parentDocs = settledListItems(docsResult, 'listLegalDocs');
    const apps = settledListItems(appsResult, 'listLegalApps');
    const usersList = settledListItems(usersResult, 'listUsers');

    setDocTypes(docTypes);
    setParentDocs(parentDocs);
    setLegalApps(apps);
    setUsers(usersList);

    if (docTypesResult.status === 'rejected') {
      console.error('Error loading legal doc types:', docTypesResult.reason);
    }
    if (docsResult.status === 'rejected') {
      console.error('Error loading legal docs (parents):', docsResult.reason);
    }
    if (appsResult.status === 'rejected') {
      console.error('Error loading legal apps:', appsResult.reason);
    }
    if (usersResult.status === 'rejected') {
      console.error('Error loading users:', usersResult.reason);
    }

    setLoadingRefs(false);
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
    setError('');
  };

  const handleUrlSuffixChange = (e) => {
    const suffix = e.target.value;
    setFormData({
      ...formData,
      url: buildUrlFromSuffix(suffix),
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const input = {
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

      await graphqlMutation(createLegalDoc, { input });
      navigate('/admin/legal-docs');
    } catch (err) {
      console.error('Error creating legal doc:', err);
      setError('Error creating legal document: ' + (err.message || 'Unknown error'));
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    navigate('/admin/legal-docs');
  };

  if (loadingRefs) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" role="status">
        <Spinner animation="border" />
        <span className="visually-hidden">Loading…</span>
      </div>
    );
  }

  const urlSuffix = urlSuffixFromFull(formData.url);

  return (
    <div className="admin-form-page">
      <Link to="/admin/legal-docs" className="admin-back-link">
        <IconArrowLeft />
        Back to Legal Docs
      </Link>

      <h1 className="admin-page-title">Create Legal Document</h1>
      <p className="admin-page-desc">
        Add a new document version and link it to its respective type and parent.
      </p>

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
                    autoComplete="off"
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
                      aria-label="Document type"
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
                <Form.Group controlId="legal-doc-app">
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
                  <Form.Text className="text-muted">
                    Restricts which user–app pairs can sign this document.
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="legal-doc-author">
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
              <InputGroup className="shadow-sm">
                <InputGroup.Text className="text-secondary bg-white">https://</InputGroup.Text>
                <Form.Control
                  value={urlSuffix}
                  onChange={handleUrlSuffixChange}
                  required
                  placeholder="example.com/legal/document.pdf"
                  aria-label="URL without protocol; https will be added automatically"
                  autoComplete="url"
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4" controlId="legal-doc-parent">
              <div className="admin-form-label-row mb-2">
                <Form.Label className="small fw-medium text-body-secondary mb-0">Parent Document</Form.Label>
                <span className="text-muted small fw-normal">Optional</span>
              </div>
              <div className="position-relative">
                <Form.Select
                  name="legalDocLegalDocChildrenId"
                  value={formData.legalDocLegalDocChildrenId}
                  onChange={handleChange}
                  className="shadow-sm pe-5"
                  style={{ appearance: 'none', WebkitAppearance: 'none' }}
                  aria-label="Parent document"
                >
                  <option value="">Search for an existing document…</option>
                  {parentDocs.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.version} — {doc.id}
                    </option>
                  ))}
                </Form.Select>
                <span
                  className="position-absolute top-50 end-0 translate-middle-y pe-3 text-secondary pe-none"
                  aria-hidden="true"
                >
                  <IconSearch />
                </span>
              </div>
              <Form.Text className="text-muted">
                Link this version to a previous overarching document if it acts as an addendum.
              </Form.Text>
            </Form.Group>

            <div className="admin-active-row">
              <Form.Check
                type="checkbox"
                name="isActive"
                id="legal-doc-active"
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
                id="legal-doc-latest"
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
            <Button
              type="button"
              variant="danger"
              className="d-inline-flex align-items-center gap-2 shadow-sm"
              onClick={handleDiscard}
            >
              <IconTrash />
              Discard
            </Button>
            <div className="d-flex flex-wrap align-items-center gap-2 ms-md-auto">
              <Button
                type="button"
                variant="outline-secondary"
                disabled
                title="Draft saving is not configured in the API yet"
                aria-describedby="save-draft-hint"
              >
                Save Draft
              </Button>
              <span id="save-draft-hint" className="visually-hidden">
                Not available until backend supports drafts
              </span>
              <Button type="submit" variant="dark" className="shadow-sm" disabled={loading}>
                {loading ? 'Publishing…' : 'Publish Document'}
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default LegalDocCreate;
