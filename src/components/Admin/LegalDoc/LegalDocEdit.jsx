import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { graphqlQuery, graphqlMutation } from '../../../utils/graphqlClient';
import { getLegalDoc } from '../../../graphql/queries';
import { listLegalDocTypes, listLegalDocs } from '../../../graphql/queries';
import { updateLegalDoc } from '../../../graphql/mutations';

const LegalDocEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    version: '',
    isActive: true,
    url: '',
    legalDocTypeLegalDocsId: '',
    legalDocLegalDocChildrenId: '',
  });
  const [docTypes, setDocTypes] = useState([]);
  const [parentDocs, setParentDocs] = useState([]);
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
        url: doc.url || '',
        legalDocTypeLegalDocsId: doc.legalDocTypeLegalDocsId || '',
        legalDocLegalDocChildrenId: doc.legalDocLegalDocChildrenId || '',
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
      const [docTypesResult, docsResult] = await Promise.all([
        graphqlQuery(listLegalDocTypes),
        graphqlQuery(listLegalDocs),
      ]);
      setDocTypes(docTypesResult.data.listLegalDocTypes.items);
      setParentDocs(docsResult.data.listLegalDocs.items);
    } catch (error) {
      console.error('Error loading references:', error);
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
        url: formData.url,
      };
      if (formData.legalDocTypeLegalDocsId) {
        input.legalDocTypeLegalDocsId = formData.legalDocTypeLegalDocsId;
      }
      if (formData.legalDocLegalDocChildrenId) {
        input.legalDocLegalDocChildrenId = formData.legalDocLegalDocChildrenId;
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
    return <Container className="mt-4">Loading...</Container>;
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h3>Edit Legal Document</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Version *</Form.Label>
              <Form.Control
                type="text"
                name="version"
                value={formData.version}
                onChange={handleChange}
                required
                placeholder="Enter version"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="isActive"
                label="Is Active"
                checked={formData.isActive}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL *</Form.Label>
              <Form.Control
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                required
                placeholder="https://example.com/document.pdf"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Document Type *</Form.Label>
              <Form.Select
                name="legalDocTypeLegalDocsId"
                value={formData.legalDocTypeLegalDocsId}
                onChange={handleChange}
                required
              >
                <option value="">Select a document type</option>
                {docTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Parent Document</Form.Label>
              <Form.Select
                name="legalDocLegalDocChildrenId"
                value={formData.legalDocLegalDocChildrenId}
                onChange={handleChange}
              >
                <option value="">None</option>
                {parentDocs.filter(doc => doc.id !== id).map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.version} - {doc.id}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </Button>
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => navigate('/admin/legal-docs')}
            >
              Cancel
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LegalDocEdit;

