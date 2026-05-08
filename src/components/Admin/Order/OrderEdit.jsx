import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { graphqlQuery, graphqlMutation } from '../../../utils/graphqlClient';
import { getOrder } from '../../../graphql/queries';
import { updateOrder } from '../../../graphql/mutations';

const OrderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerID: '',
    accountRepresentativeID: '',
    productID: '',
    status: '',
    amount: 0,
    date: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const result = await graphqlQuery(getOrder, { id });
      const order = result.data.getOrder;
      setFormData({
        customerID: order.customerID || '',
        accountRepresentativeID: order.accountRepresentativeID || '',
        productID: order.productID || '',
        status: order.status || '',
        amount: order.amount || 0,
        date: order.date || '',
      });
      setLoadingData(false);
    } catch (err) {
      console.error('Error loading order:', err);
      setError('Error loading order');
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;
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
      await API.graphql(
        graphqlOperation(updateOrder, {
          input: {
            id,
            ...formData,
          },
        })
      );
      navigate('/admin/orders');
    } catch (err) {
      console.error('Error updating order:', err);
      setError('Error updating order: ' + (err.message || 'Unknown error'));
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
          <h3>Edit Order</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Customer ID *</Form.Label>
              <Form.Control
                type="text"
                name="customerID"
                value={formData.customerID}
                onChange={handleChange}
                required
                placeholder="Enter customer ID"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Account Representative ID *</Form.Label>
              <Form.Control
                type="text"
                name="accountRepresentativeID"
                value={formData.accountRepresentativeID}
                onChange={handleChange}
                required
                placeholder="Enter account representative ID"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product ID *</Form.Label>
              <Form.Control
                type="text"
                name="productID"
                value={formData.productID}
                onChange={handleChange}
                required
                placeholder="Enter product ID"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status *</Form.Label>
              <Form.Control
                type="text"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                placeholder="Enter status"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Amount *</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date *</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </Button>
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => navigate('/admin/orders')}
            >
              Cancel
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderEdit;

