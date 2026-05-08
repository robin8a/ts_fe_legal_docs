import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { graphqlQuery, graphqlMutation } from '../../../utils/graphqlClient';
import { listLegalApps } from '../../../graphql/queries';
import { createUser } from '../../../graphql/mutations';

const UserCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    legalAppUsersId: '',
  });
  const [legalApps, setLegalApps] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingApps, setLoadingApps] = useState(true);

  useEffect(() => {
    loadLegalApps();
  }, []);

  const loadLegalApps = async () => {
    try {
      const result = await graphqlQuery(listLegalApps);
      setLegalApps(result.data.listLegalApps.items);
      setLoadingApps(false);
    } catch (error) {
      console.error('Error loading legal apps:', error);
      setLoadingApps(false);
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
      const input = { name: formData.name };
      if (formData.legalAppUsersId) {
        input.legalAppUsersId = formData.legalAppUsersId;
      }
      await graphqlMutation(createUser, {
        input,
      });
      navigate('/admin/users');
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Error creating user: ' + (err.message || 'Unknown error'));
      setLoading(false);
    }
  };

  if (loadingApps) {
    return <Container className="mt-4">Loading...</Container>;
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h3>Create User</h3>
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
                placeholder="Enter user name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Legal App</Form.Label>
              <Form.Select
                name="legalAppUsersId"
                value={formData.legalAppUsersId}
                onChange={handleChange}
              >
                <option value="">None</option>
                {legalApps.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.name}
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
              onClick={() => navigate('/admin/users')}
            >
              Cancel
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserCreate;

