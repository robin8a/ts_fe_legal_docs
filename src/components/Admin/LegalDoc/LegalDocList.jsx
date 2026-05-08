import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { graphqlQuery, graphqlMutation } from '../../../utils/graphqlClient';
import { listLegalDocs } from '../../../graphql/queries';
import { deleteLegalDoc } from '../../../graphql/mutations';

const LegalDocList = () => {
  const [legalDocs, setLegalDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLegalDocs();
  }, []);

  const loadLegalDocs = async () => {
    try {
      const result = await graphqlQuery(listLegalDocs);
      setLegalDocs(result.data.listLegalDocs.items);
      setLoading(false);
    } catch (error) {
      console.error('Error loading legal docs:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this legal document?')) {
      try {
        await API.graphql(graphqlOperation(deleteLegalDoc, { input: { id } }));
        loadLegalDocs();
      } catch (error) {
        console.error('Error deleting legal doc:', error);
        alert('Error deleting legal document');
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
          <h3>Legal Documents</h3>
          <Button as={Link} to="/admin/legal-docs/create" variant="primary">
            Create New
          </Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Version</th>
                <th>Active</th>
                <th>URL</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {legalDocs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No legal documents found</td>
                </tr>
              ) : (
                legalDocs.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.id}</td>
                    <td>{doc.version}</td>
                    <td>
                      <Badge bg={doc.isActive ? 'success' : 'secondary'}>
                        {doc.isActive ? 'Yes' : 'No'}
                      </Badge>
                    </td>
                    <td>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        {doc.url.length > 50 ? doc.url.substring(0, 50) + '...' : doc.url}
                      </a>
                    </td>
                    <td>{new Date(doc.createdAt).toLocaleString()}</td>
                    <td>
                      <Button
                        as={Link}
                        to={`/admin/legal-docs/${doc.id}/edit`}
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
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

export default LegalDocList;

