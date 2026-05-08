import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { graphqlQuery, graphqlMutation } from '../../../utils/graphqlClient';
import { listLegalDocTypes } from '../../../graphql/queries';
import { deleteLegalDocType } from '../../../graphql/mutations';

const LegalDocTypeList = () => {
  const [docTypes, setDocTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocTypes();
  }, []);

  const loadDocTypes = async () => {
    try {
      const result = await graphqlQuery(listLegalDocTypes);
      setDocTypes(result.data.listLegalDocTypes.items);
      setLoading(false);
    } catch (error) {
      console.error('Error loading doc types:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document type?')) {
      try {
        await API.graphql(graphqlOperation(deleteLegalDocType, { input: { id } }));
        loadDocTypes();
      } catch (error) {
        console.error('Error deleting doc type:', error);
        alert('Error deleting document type');
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
          <h3>Legal Document Types</h3>
          <Button as={Link} to="/admin/legal-doc-types/create" variant="primary">
            Create New
          </Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Short Name</th>
                <th>Description</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {docTypes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No document types found</td>
                </tr>
              ) : (
                docTypes.map((docType) => (
                  <tr key={docType.id}>
                    <td>{docType.id}</td>
                    <td>{docType.name}</td>
                    <td>{docType.shortName || 'N/A'}</td>
                    <td>{docType.description || 'N/A'}</td>
                    <td>{new Date(docType.createdAt).toLocaleString()}</td>
                    <td>
                      <Button
                        as={Link}
                        to={`/admin/legal-doc-types/${docType.id}/edit`}
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(docType.id)}
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

export default LegalDocTypeList;

