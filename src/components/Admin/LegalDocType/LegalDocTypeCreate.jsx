import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { graphqlQuery, graphqlMutation } from '../../../utils/graphqlClient';
import { createLegalDocType } from '../../../graphql/mutations';

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
      const input = { name: formData.name };
      if (formData.shortName) input.shortName = formData.shortName;
      if (formData.description) input.description = formData.description;

      await graphqlMutation(createLegalDocType, { input });
      navigate('/admin/legal-doc-types');
    } catch (err) {
      console.error('Error creating doc type:', err);
      setError('Error creating document type: ' + (err.message || 'Unknown error'));
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h3>Create Legal Document Type</h3>
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
              {loading ? 'Creating...' : 'Create'}
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

export default LegalDocTypeCreate;

