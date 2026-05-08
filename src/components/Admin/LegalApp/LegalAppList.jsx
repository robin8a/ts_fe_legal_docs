import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { graphqlQuery, graphqlMutation } from '../../../utils/graphqlClient';
import { listLegalApps } from '../../../graphql/queries';
import { deleteLegalApp } from '../../../graphql/mutations';

const LegalAppList = () => {
  const [legalApps, setLegalApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLegalApps();
  }, []);

  const loadLegalApps = async () => {
    try {
      const result = await graphqlQuery(listLegalApps);
      setLegalApps(result.data.listLegalApps.items);
      setLoading(false);
    } catch (error) {
      console.error('Error loading legal apps:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this legal app?')) {
      try {
        await graphqlMutation(deleteLegalApp, { input: { id } });
        loadLegalApps();
      } catch (error) {
        console.error('Error deleting legal app:', error);
        alert('Error deleting legal app');
      }
    }
  };

  if (loading) {
    return <Container className="mt-4">Loading...</Container>;
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>Legal Apps</h3>
          <Button as={Link} to="/admin/legal-apps/create" variant="primary">
            Create New
          </Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {legalApps.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">No legal apps found</td>
                </tr>
              ) : (
                legalApps.map((app) => (
                  <tr key={app.id}>
                    <td>{app.id}</td>
                    <td>{app.name}</td>
                    <td>{new Date(app.createdAt).toLocaleString()}</td>
                    <td>{new Date(app.updatedAt).toLocaleString()}</td>
                    <td>
                      <Button
                        as={Link}
                        to={`/admin/legal-apps/${app.id}/edit`}
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(app.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LegalAppList;

