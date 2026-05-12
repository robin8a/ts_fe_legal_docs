import React, { useState } from 'react';
import { Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { graphqlMutation } from '../../../utils/graphqlClient';
import { createOrder } from '../../../graphql/mutations';
import { IconArrowLeft } from '../icons/AdminIcons';

const OrderCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerID: '',
    accountRepresentativeID: '',
    productID: '',
    status: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value, 10) || 0 : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await graphqlMutation(createOrder, { input: formData });
      navigate('/admin/orders');
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.message || 'No se pudo crear el pedido.');
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-page">
      <Link to="/admin/orders" className="admin-back-link">
        <IconArrowLeft />
        Volver a pedidos
      </Link>

      <h1 className="admin-page-title">Nuevo pedido</h1>
      <p className="admin-page-desc">
        Alta manual de un pedido: cliente, representante, producto, estado, importe y fecha.
      </p>

      {error ? <Alert variant="danger" className="mt-3">{error}</Alert> : null}

      <Form className="mt-4" onSubmit={handleSubmit} noValidate>
        <div className="admin-form-card">
          <div className="admin-form-card-body admin-form-control-like">
            <Row className="g-4 mb-0">
              <Col md={6}>
                <Form.Group controlId="order-customer">
                  <Form.Label className="small fw-medium text-body-secondary">ID cliente *</Form.Label>
                  <Form.Control
                    type="text"
                    name="customerID"
                    value={formData.customerID}
                    onChange={handleChange}
                    required
                    placeholder="Identificador del cliente"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="order-rep">
                  <Form.Label className="small fw-medium text-body-secondary">ID representante *</Form.Label>
                  <Form.Control
                    type="text"
                    name="accountRepresentativeID"
                    value={formData.accountRepresentativeID}
                    onChange={handleChange}
                    required
                    placeholder="Cuenta o usuario representante"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="order-product">
                  <Form.Label className="small fw-medium text-body-secondary">ID producto *</Form.Label>
                  <Form.Control
                    type="text"
                    name="productID"
                    value={formData.productID}
                    onChange={handleChange}
                    required
                    placeholder="SKU o ID de producto"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="order-status">
                  <Form.Label className="small fw-medium text-body-secondary">Estado *</Form.Label>
                  <Form.Control
                    type="text"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    placeholder="Ej. pending, completed"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="order-amount">
                  <Form.Label className="small fw-medium text-body-secondary">Importe *</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min={0}
                    step={1}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="order-date">
                  <Form.Label className="small fw-medium text-body-secondary">Fecha *</Form.Label>
                  <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div className="admin-form-card-footer">
            <Button type="button" variant="outline-secondary" onClick={() => navigate('/admin/orders')}>
              Cancelar
            </Button>
            <Button type="submit" variant="dark" className="shadow-sm" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" aria-hidden />
                  Creando…
                </>
              ) : (
                'Crear pedido'
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default OrderCreate;
