import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { graphqlQuery, graphqlMutation } from '../../../utils/graphqlClient';
import { listLegalDocRecords } from '../../../graphql/queries';
import { deleteLegalDocRecord } from '../../../graphql/mutations';

const LegalDocRecordList = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const result = await graphqlQuery(listLegalDocRecords);
      setRecords(result.data.listLegalDocRecords.items);
      setLoading(false);
    } catch (error) {
      console.error('Error loading records:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await API.graphql(graphqlOperation(deleteLegalDocRecord, { input: { id } }));
        loadRecords();
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Error deleting record');
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
          <h3>Legal Document Records</h3>
          <Button as={Link} to="/admin/legal-doc-records/create" variant="primary">
            Create New
          </Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Sign</th>
                <th>Legal Sign Date</th>
                <th>User ID</th>
                <th>Legal Doc ID</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">No records found</td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{record.sign}</td>
                    <td>{new Date(record.legalSignDate * 1000).toLocaleString()}</td>
                    <td>{record.userLegalDocRecordsId || 'N/A'}</td>
                    <td>{record.legalDocLegalDocRecordsId || 'N/A'}</td>
                    <td>{new Date(record.createdAt).toLocaleString()}</td>
                    <td>
                      <Button
                        as={Link}
                        to={`/admin/legal-doc-records/${record.id}/edit`}
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(record.id)}
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

export default LegalDocRecordList;

