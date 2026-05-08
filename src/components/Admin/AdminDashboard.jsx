import React from 'react';
import { Container, Navbar, Nav, NavbarBrand } from 'react-bootstrap';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

// Import entity components
import LegalAppList from './LegalApp/LegalAppList';
import LegalAppCreate from './LegalApp/LegalAppCreate';
import LegalAppEdit from './LegalApp/LegalAppEdit';

import UserList from './User/UserList';
import UserCreate from './User/UserCreate';
import UserEdit from './User/UserEdit';

import LegalDocTypeList from './LegalDocType/LegalDocTypeList';
import LegalDocTypeCreate from './LegalDocType/LegalDocTypeCreate';
import LegalDocTypeEdit from './LegalDocType/LegalDocTypeEdit';

import LegalDocList from './LegalDoc/LegalDocList';
import LegalDocCreate from './LegalDoc/LegalDocCreate';
import LegalDocEdit from './LegalDoc/LegalDocEdit';

import LegalDocRecordList from './LegalDocRecord/LegalDocRecordList';
import LegalDocRecordCreate from './LegalDocRecord/LegalDocRecordCreate';
import LegalDocRecordEdit from './LegalDocRecord/LegalDocRecordEdit';

import OrderList from './Order/OrderList';
import OrderCreate from './Order/OrderCreate';
import OrderEdit from './Order/OrderEdit';

const AdminDashboard = () => {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <NavbarBrand>Legal Docs Admin</NavbarBrand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/admin/legal-apps" active={location.pathname.includes('/legal-apps')}>
              Legal Apps
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/users" active={location.pathname.includes('/users')}>
              Users
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/legal-doc-types" active={location.pathname.includes('/legal-doc-types')}>
              Doc Types
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/legal-docs" active={location.pathname.includes('/legal-docs')}>
              Legal Docs
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/legal-doc-records" active={location.pathname.includes('/legal-doc-records')}>
              Doc Records
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/orders" active={location.pathname.includes('/orders')}>
              Orders
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container fluid className="mt-4">
        <Routes>
          {/* LegalApp Routes */}
          <Route path="legal-apps" element={<LegalAppList />} />
          <Route path="legal-apps/create" element={<LegalAppCreate />} />
          <Route path="legal-apps/:id/edit" element={<LegalAppEdit />} />

          {/* User Routes */}
          <Route path="users" element={<UserList />} />
          <Route path="users/create" element={<UserCreate />} />
          <Route path="users/:id/edit" element={<UserEdit />} />

          {/* LegalDocType Routes */}
          <Route path="legal-doc-types" element={<LegalDocTypeList />} />
          <Route path="legal-doc-types/create" element={<LegalDocTypeCreate />} />
          <Route path="legal-doc-types/:id/edit" element={<LegalDocTypeEdit />} />

          {/* LegalDoc Routes */}
          <Route path="legal-docs" element={<LegalDocList />} />
          <Route path="legal-docs/create" element={<LegalDocCreate />} />
          <Route path="legal-docs/:id/edit" element={<LegalDocEdit />} />

          {/* LegalDocRecord Routes */}
          <Route path="legal-doc-records" element={<LegalDocRecordList />} />
          <Route path="legal-doc-records/create" element={<LegalDocRecordCreate />} />
          <Route path="legal-doc-records/:id/edit" element={<LegalDocRecordEdit />} />

          {/* Order Routes */}
          <Route path="orders" element={<OrderList />} />
          <Route path="orders/create" element={<OrderCreate />} />
          <Route path="orders/:id/edit" element={<OrderEdit />} />

          {/* Default route */}
          <Route index element={<LegalAppList />} />
        </Routes>
      </Container>
    </div>
  );
};

export default AdminDashboard;

