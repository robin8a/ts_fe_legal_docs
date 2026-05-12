import React, { useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { Button, Offcanvas } from 'react-bootstrap';
import {
  IconScale,
  IconLayoutGrid,
  IconUsers,
  IconFileType,
  IconFileText,
  IconCheckSquare,
  IconShoppingCart,
  IconPlus,
  IconSearch,
  IconMenu,
  IconBell,
} from './icons/AdminIcons';

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

const SECTION_META = {
  'legal-apps': {
    title: 'Legal Apps',
    subtitle: 'Applications linked to your compliance workspace.',
    createPath: '/admin/legal-apps/create',
    createLabel: 'Create Legal App',
  },
  users: {
    title: 'Users',
    subtitle: 'People who can sign in and manage content.',
    createPath: '/admin/users/create',
    createLabel: 'Create User',
  },
  'legal-doc-types': {
    title: 'Document Types',
    subtitle: 'Templates and categories for legal documents.',
    createPath: '/admin/legal-doc-types/create',
    createLabel: 'Create Doc Type',
  },
  'legal-docs': {
    title: 'Legal Documents',
    subtitle: 'Versions, URLs, and publication status.',
    createPath: '/admin/legal-docs/create',
    createLabel: 'Create Legal Doc',
  },
  'legal-doc-records': {
    title: 'Document Records',
    subtitle: 'Signed or filed instances of each document.',
    createPath: '/admin/legal-doc-records/create',
    createLabel: 'Create Record',
  },
  orders: {
    title: 'Orders',
    subtitle: 'Commerce and billing activity in one place.',
    createPath: '/admin/orders/create',
    createLabel: 'Create Order',
  },
};

const navItems = [
  {
    to: '/admin/legal-apps',
    label: 'Legal Apps',
    match: (p) => p === '/admin' || p === '/admin/' || p.startsWith('/admin/legal-apps'),
    Icon: IconLayoutGrid,
  },
  { to: '/admin/users', label: 'Users', match: (p) => p.startsWith('/admin/users'), Icon: IconUsers },
  {
    to: '/admin/legal-doc-types',
    label: 'Doc Types',
    match: (p) => p.startsWith('/admin/legal-doc-types'),
    Icon: IconFileType,
  },
  {
    to: '/admin/legal-docs',
    label: 'Legal Docs',
    match: (p) => p.startsWith('/admin/legal-docs'),
    Icon: IconFileText,
  },
  {
    to: '/admin/legal-doc-records',
    label: 'Doc Records',
    match: (p) => p.startsWith('/admin/legal-doc-records'),
    Icon: IconCheckSquare,
  },
  { to: '/admin/orders', label: 'Orders', match: (p) => p.startsWith('/admin/orders'), Icon: IconShoppingCart },
];

const resolveSection = (pathname) => {
  const normalized = pathname.replace(/\/$/, '') || '/admin';
  const segs = normalized.split('/').filter(Boolean);
  if (segs[0] !== 'admin') return 'legal-apps';
  return segs[1] || 'legal-apps';
};

const shouldHideCreateCta = (pathname) => {
  const normalized = pathname.replace(/\/$/, '') || '/admin';
  return /\/create$/.test(normalized) || /\/edit$/.test(normalized);
};

const isOrdersListOnly = (pathname) => {
  const normalized = pathname.replace(/\/$/, '') || '/admin';
  return normalized === '/admin/orders';
};

const AdminDashboard = () => {
  const { pathname } = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const section = resolveSection(pathname);
  const meta = SECTION_META[section] || SECTION_META['legal-apps'];
  const hideCta = shouldHideCreateCta(pathname);
  const ordersDenseList = isOrdersListOnly(pathname);

  const renderNavLinks = () =>
    navItems.map(({ to, label, match, Icon }) => (
      <Link
        key={to}
        to={to}
        className={`admin-sidebar-nav-link${match(pathname) ? ' active' : ''}`}
        onClick={() => setMobileNavOpen(false)}
      >
        <span className="admin-sidebar-nav-icon" aria-hidden="true">
          <Icon />
        </span>
        {label}
      </Link>
    ));

  return (
    <div className="admin-shell admin-shell-sidebar-layout">
      <aside className="admin-sidebar d-none d-md-flex" aria-label="Navegación principal">
        <Link to="/admin" className="admin-sidebar-brand">
          <span className="admin-sidebar-brand-mark">
            <IconScale />
          </span>
          <span className="admin-sidebar-brand-title">Legal Docs Admin</span>
        </Link>
        <nav className="admin-sidebar-nav">{renderNavLinks()}</nav>
        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-footer-avatar" aria-hidden="true">
            AD
          </div>
          <div className="min-w-0">
            <div className="small fw-medium text-truncate">Admin User</div>
            <div className="text-muted small">admin@legaldocs.io</div>
          </div>
        </div>
      </aside>

      <Offcanvas
        show={mobileNavOpen}
        onHide={() => setMobileNavOpen(false)}
        placement="start"
        className="admin-offcanvas-nav"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title as="div" className="d-flex align-items-center gap-2">
            <span className="admin-sidebar-brand-mark">
              <IconScale />
            </span>
            <span className="fw-bold">Legal Docs Admin</span>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column pt-0">
          <nav className="admin-sidebar-nav flex-grow-1" aria-label="Principal móvil">
            {renderNavLinks()}
          </nav>
          <div className="admin-sidebar-footer border-0 pt-3 mt-2">
            <div className="admin-sidebar-footer-avatar" aria-hidden="true">
              AD
            </div>
            <div className="min-w-0">
              <div className="small fw-medium text-truncate">Admin User</div>
              <div className="text-muted small">admin@legaldocs.io</div>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <div className="admin-content">
        <header
          className={
            ordersDenseList
              ? 'admin-content-header d-flex d-md-none flex-shrink-0'
              : 'admin-content-header'
          }
        >
          <div className="admin-content-header-lead min-w-0">
            <div className="d-flex align-items-start gap-3 min-w-0">
              <Button
                type="button"
                variant="link"
                className="d-md-none p-1 text-secondary admin-content-menu-btn"
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open navigation menu"
              >
                <IconMenu />
              </Button>
              <div className="min-w-0">
                <h1 className="admin-content-title text-truncate">{meta.title}</h1>
                {!ordersDenseList ? (
                  <p className="admin-content-subtitle text-truncate mb-0">{meta.subtitle}</p>
                ) : null}
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2 gap-md-3 flex-shrink-0">
            <label className="admin-content-search admin-content-search--sm mb-0" htmlFor="admin-global-search">
              <IconSearch />
              <input
                id="admin-global-search"
                type="search"
                className="admin-content-search-input"
                placeholder="Search…"
                aria-label="Global search"
              />
            </label>
            <Button
              type="button"
              variant="light"
              size="sm"
              className="admin-header-icon-btn d-none d-sm-inline-flex"
              title="Notifications — available soon"
              aria-label="Notifications — available soon"
              disabled
            >
              <IconBell />
            </Button>
            {!hideCta ? (
              <Button
                as={Link}
                to={meta.createPath}
                variant="dark"
                size="sm"
                className="d-inline-flex align-items-center gap-2 shadow-sm text-nowrap"
              >
                <IconPlus />
                {meta.createLabel}
              </Button>
            ) : null}
          </div>
        </header>

        <div
          className={
            ordersDenseList
              ? 'admin-content-main admin-content-main--orders-dense'
              : 'admin-content-main'
          }
        >
          <Routes>
            <Route path="legal-apps" element={<LegalAppList />} />
            <Route path="legal-apps/create" element={<LegalAppCreate />} />
            <Route path="legal-apps/:id/edit" element={<LegalAppEdit />} />

            <Route path="users" element={<UserList />} />
            <Route path="users/create" element={<UserCreate />} />
            <Route path="users/:id/edit" element={<UserEdit />} />

            <Route path="legal-doc-types" element={<LegalDocTypeList />} />
            <Route path="legal-doc-types/create" element={<LegalDocTypeCreate />} />
            <Route path="legal-doc-types/:id/edit" element={<LegalDocTypeEdit />} />

            <Route path="legal-docs" element={<LegalDocList />} />
            <Route path="legal-docs/create" element={<LegalDocCreate />} />
            <Route path="legal-docs/:id/edit" element={<LegalDocEdit />} />

            <Route path="legal-doc-records" element={<LegalDocRecordList />} />
            <Route path="legal-doc-records/create" element={<LegalDocRecordCreate />} />
            <Route path="legal-doc-records/:id/edit" element={<LegalDocRecordEdit />} />

            <Route path="orders" element={<OrderList />} />
            <Route path="orders/create" element={<OrderCreate />} />
            <Route path="orders/:id/edit" element={<OrderEdit />} />

            <Route index element={<LegalAppList />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
