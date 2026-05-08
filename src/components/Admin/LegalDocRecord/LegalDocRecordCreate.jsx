import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { graphqlQuery, graphqlMutation } from '../../../utils/graphqlClient';
import { listUsers, listLegalDocs } from '../../../graphql/queries';
import { createLegalDocRecord } from '../../../graphql/mutations';

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

  useEffect(() => {
    loadReferences();
  }, []);

  const loadReferences = async () => {
    try {
      const [usersResult, docsResult] = await Promise.all([
        graphqlQuery(listUsers),
        graphqlQuery(listLegalDocs),
      ]);
      setUsers(usersResult.data.listUsers.items);
      setLegalDocs(docsResult.data.listLegalDocs.items);
      setLoadingRefs(false);
    } catch (error) {
      console.error('Error loading references:', error);
      setLoadingRefs(false);
    }
  };

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'legalSignDate') {
      const date = new Date(e.target.value);
      value = Math.floor(date.getTime() / 1000);
    }
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
        sign: formData.sign,
        legalSignDate: parseInt(formData.legalSignDate),
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
      setError('Error creating record: ' + (err.message || 'Unknown error'));
      setLoading(false);
    }
  };

  if (loadingRefs) {
    return <Container className="mt-4">Loading...</Container>;
  }

  const dateValue = new Date(formData.legalSignDate * 1000).toISOString().slice(0, 16);

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h3>Create Legal Document Record</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Sign *</Form.Label>
              <Form.Control
                type="text"
                name="sign"
                value={formData.sign}
                onChange={handleChange}
                required
                placeholder="Enter sign"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Legal Sign Date *</Form.Label>
              <Form.Control
                type="datetime-local"
                name="legalSignDate"
                value={dateValue}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>User</Form.Label>
              <Form.Select
                name="userLegalDocRecordsId"
                value={formData.userLegalDocRecordsId}
                onChange={handleChange}
              >
                <option value="">None</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Legal Document</Form.Label>
              <Form.Select
                name="legalDocLegalDocRecordsId"
                value={formData.legalDocLegalDocRecordsId}
                onChange={handleChange}
              >
                <option value="">None</option>
                {legalDocs.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.version} - {doc.id}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </Button>
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => navigate('/admin/legal-doc-records')}
            >
              Cancel
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LegalDocRecordCreate;

