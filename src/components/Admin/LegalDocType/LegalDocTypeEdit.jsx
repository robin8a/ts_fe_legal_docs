import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { graphqlQuery, graphqlMutation } from '../../../utils/graphqlClient';
import { getLegalDocType } from '../../../graphql/queries';
import { updateLegalDocType } from '../../../graphql/mutations';

const LegalDocTypeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadDocType();
  }, [id]);

  const loadDocType = async () => {
    try {
      const result = await graphqlQuery(getLegalDocType, { id });
      const docType = result.data.getLegalDocType;
      setFormData({
        name: docType.name || '',
        shortName: docType.shortName || '',
        description: docType.description || '',
      });
      setLoadingData(false);
    } catch (err) {
      console.error('Error loading doc type:', err);
      setError('Error loading document type');
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
        name: formData.name,
      };
      if (formData.shortName) input.shortName = formData.shortName;
      if (formData.description) input.description = formData.description;

      await graphqlMutation(updateLegalDocType, { input });
      navigate('/admin/legal-doc-types');
    } catch (err) {
      console.error('Error updating doc type:', err);
      setError('Error updating document type: ' + (err.message || 'Unknown error'));
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
          <h3>Edit Legal Document Type</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter document type name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Short Name</Form.Label>
              <Form.Control
                type="text"
                name="shortName"
                value={formData.shortName}
                onChange={handleChange}
                placeholder="Enter short name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </Button>
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => navigate('/admin/legal-doc-types')}
            >
              Cancel
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LegalDocTypeEdit;

