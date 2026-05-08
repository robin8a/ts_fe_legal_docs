import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { graphqlQuery, graphqlMutation } from '../../../utils/graphqlClient';
import { getLegalDocRecord } from '../../../graphql/queries';
import { listUsers, listLegalDocs } from '../../../graphql/queries';
import { updateLegalDocRecord } from '../../../graphql/mutations';

const LegalDocRecordEdit = () => {
  const { id } = useParams();
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
        userLegalDocRecordsId: record.userLegalDocRecordsId || '',
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
      const [usersResult, docsResult] = await Promise.all([
        graphqlQuery(listUsers),
        graphqlQuery(listLegalDocs),
      ]);
      setUsers(usersResult.data.listUsers.items);
      setLegalDocs(docsResult.data.listLegalDocs.items);
    } catch (error) {
      console.error('Error loading references:', error);
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
        id,
        sign: formData.sign,
        legalSignDate: parseInt(formData.legalSignDate),
      };
      if (formData.userLegalDocRecordsId) {
        input.userLegalDocRecordsId = formData.userLegalDocRecordsId;
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
    return <Container className="mt-4">Loading...</Container>;
  }

  const dateValue = new Date(formData.legalSignDate * 1000).toISOString().slice(0, 16);

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h3>Edit Legal Document Record</h3>
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
              {loading ? 'Updating...' : 'Update'}
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

export default LegalDocRecordEdit;

