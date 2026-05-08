import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { graphqlQuery, graphqlMutation } from '../../../utils/graphqlClient';
import { getUser } from '../../../graphql/queries';
import { listLegalApps } from '../../../graphql/queries';
import { updateUser } from '../../../graphql/mutations';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    legalAppUsersId: '',
  });
  const [legalApps, setLegalApps] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadUser();
    loadLegalApps();
  }, [id]);

  const loadUser = async () => {
    try {
      const result = await graphqlQuery(getUser, { id });
      const user = result.data.getUser;
      setFormData({
        name: user.name || '',
        legalAppUsersId: user.legalAppUsersId || '',
      });
      setLoadingData(false);
    } catch (err) {
      console.error('Error loading user:', err);
      setError('Error loading user');
      setLoadingData(false);
    }
  };

  const loadLegalApps = async () => {
    try {
      const result = await graphqlQuery(listLegalApps);
      setLegalApps(result.data.listLegalApps.items);
    } catch (error) {
      console.error('Error loading legal apps:', error);
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
      if (formData.legalAppUsersId) {
        input.legalAppUsersId = formData.legalAppUsersId;
      }
      await graphqlMutation(updateUser, {
        input,
      });
      navigate('/admin/users');
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Error updating user: ' + (err.message || 'Unknown error'));
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
          <h3>Edit User</h3>
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
              {loading ? 'Updating...' : 'Update'}
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

export default UserEdit;

