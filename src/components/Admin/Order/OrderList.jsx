import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Dropdown,
  Form,
  Modal,
  Spinner,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { graphqlQuery, graphqlMutation } from '../../../utils/graphqlClient';
import { listOrders } from '../../../graphql/queries';
import { deleteOrder } from '../../../graphql/mutations';
import {
  IconChevronDown,
  IconDownload,
  IconEye,
  IconFilter,
  IconMoreVertical,
  IconPlus,
  IconSearch,
  IconAlertTriangle,
} from '../icons/AdminIcons';

const PAGE_SIZE = 10;

const FILTER_LABELS = {
  all: 'All Orders',
  completed: 'Completed',
  pending: 'Pending',
  failed: 'Failed',
  refunded: 'Refunded',
};

const statusCategory = (status) => {
  const s = (status || '').toString().trim().toLowerCase();
  if (s.includes('complete')) return 'completed';
  if (s.includes('pending')) return 'pending';
  if (s.includes('fail')) return 'failed';
  if (s.includes('refund')) return 'refunded';
  return 'other';
};

const statusPillClass = (status) => {
  const cat = statusCategory(status);
  if (cat === 'completed') return 'admin-pill admin-pill-success';
  if (cat === 'pending') return 'admin-pill admin-pill-warn';
  if (cat === 'failed') return 'admin-pill admin-pill-danger';
  if (cat === 'refunded') return 'admin-pill';
  return 'admin-pill';
};

const formatAmount = (amount) => {
  const n = typeof amount === 'number' ? amount : parseFloat(String(amount));
  if (Number.isNaN(n)) return String(amount ?? '—');
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n);
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const shortOrderId = (id) => {
  if (!id) return '—';
  if (id.length <= 12) return id;
  return `${id.slice(0, 4)}…${id.slice(-4)}`;
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      const result = await graphqlQuery(listOrders);
      setOrders(result.data.listOrders.items);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== 'all' && statusCategory(o.status) !== statusFilter) {
        return false;
      }
      if (!q) return true;
      const hay = [
        o.id,
        o.customerID,
        o.accountRepresentativeID,
        o.productID,
        o.status,
        String(o.amount),
        o.date,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [orders, search, statusFilter]);

  useEffect(() => {
    setPage(0);
  }, [search, statusFilter, orders.length]);

  const pageCount = filtered.length === 0 ? 0 : Math.ceil(filtered.length / PAGE_SIZE);
  const safePage = pageCount === 0 ? 0 : Math.min(page, pageCount - 1);
  const pageSlice = useMemo(() => {
    if (pageCount === 0) return [];
    const start = safePage * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage, pageCount]);

  useEffect(() => {
    if (pageCount === 0) {
      setPage(0);
      return;
    }
    setPage((p) => Math.min(p, pageCount - 1));
  }, [pageCount]);

  const visibleIds = pageSlice.map((o) => o.id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selected[id]);

  const handleToggleAllVisible = () => {
    if (allVisibleSelected) {
      setSelected((prev) => {
        const next = { ...prev };
        visibleIds.forEach((id) => {
          delete next[id];
        });
        return next;
      });
      return;
    }
    setSelected((prev) => {
      const next = { ...prev };
      visibleIds.forEach((id) => {
        next[id] = true;
      });
      return next;
    });
  };

  const handleToggleRow = (id) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
  };

  const handleExportCsv = () => {
    const headers = [
      'Order ID',
      'Date',
      'Customer ID',
      'Rep ID',
      'Product ID',
      'Amount',
      'Status',
    ];
    const rows = filtered.map((o) =>
      [
        o.id,
        o.date ?? '',
        o.customerID ?? '',
        o.accountRepresentativeID ?? '',
        o.productID ?? '',
        o.amount ?? '',
        o.status ?? '',
      ]
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(','),
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await graphqlMutation(deleteOrder, { input: { id: deleteTarget.id } });
      setDeleteTarget(null);
      setSelected({});
      await loadOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Error deleting order');
    } finally {
      setDeleting(false);
    }
  };

  const fromIdx = filtered.length === 0 ? 0 : safePage * PAGE_SIZE + 1;
  const toIdx = filtered.length === 0 ? 0 : Math.min((safePage + 1) * PAGE_SIZE, filtered.length);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 flex-grow-1" role="status">
        <Spinner animation="border" />
        <span className="visually-hidden">Loading…</span>
      </div>
    );
  }

  return (
    <div className="admin-orders-view">
      <div className="admin-orders-toolbar">
        <div className="admin-orders-toolbar-left min-w-0">
          <h2 className="admin-orders-toolbar-title text-truncate d-flex align-items-center flex-wrap gap-1">
            <span>Orders</span>
            <span className="admin-orders-toolbar-count">{filtered.length}</span>
          </h2>
          <span className="admin-orders-toolbar-divider d-none d-sm-block" aria-hidden="true" />
          <Dropdown>
            <Dropdown.Toggle
              variant="light"
              size="sm"
              id="orders-filter-toggle"
              className="admin-orders-filter-trigger border-0 text-decoration-none d-inline-flex align-items-center shadow-none"
            >
              <IconFilter />
              <span className="d-none d-sm-inline">{FILTER_LABELS[statusFilter]}</span>
              <span className="d-sm-none">Filter</span>
              <IconChevronDown />
            </Dropdown.Toggle>
            <Dropdown.Menu align="start" aria-labelledby="orders-filter-toggle">
              {Object.entries(FILTER_LABELS).map(([key, label]) => (
                <Dropdown.Item
                  key={key}
                  active={statusFilter === key}
                  onClick={() => setStatusFilter(key)}
                >
                  {label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="admin-orders-toolbar-right">
          <label className="admin-orders-search-wrap mb-0" htmlFor="orders-search-input">
            <IconSearch />
            <input
              id="orders-search-input"
              type="search"
              className="admin-orders-search-input"
              placeholder="Search orders by ID, Customer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search orders"
            />
          </label>
          <Button
            type="button"
            variant="dark"
            size="sm"
            className="d-inline-flex align-items-center gap-1 text-nowrap"
            onClick={handleExportCsv}
          >
            <IconDownload />
            <span className="d-none d-sm-inline">Export</span>
          </Button>
          <Button
            as={Link}
            to="/admin/orders/create"
            variant="dark"
            size="sm"
            className="d-inline-flex align-items-center gap-1 text-nowrap"
          >
            <IconPlus />
            <span className="d-none d-sm-inline">Create</span>
          </Button>
        </div>
      </div>

      <div className="admin-orders-panel">
        <div className="admin-orders-colhead">
          <div className="admin-orders-col-check">
            <Form.Check
              type="checkbox"
              checked={allVisibleSelected}
              onChange={handleToggleAllVisible}
              aria-label="Select all orders on this page"
              disabled={pageSlice.length === 0}
            />
          </div>
          <div className="admin-orders-col-id">Order ID</div>
          <div className="admin-orders-col-date">Date</div>
          <div className="admin-orders-col-grow">Customer ID</div>
          <div className="admin-orders-col-grow">Rep ID</div>
          <div className="admin-orders-col-product">Product ID</div>
          <div className="admin-orders-col-amount">Amount</div>
          <div className="admin-orders-col-status">Status</div>
          <div className="admin-orders-col-actions text-end">Action</div>
        </div>

        <div className="admin-orders-scroll">
          {pageSlice.length === 0 ? (
            <div className="admin-orders-empty">
              {orders.length === 0
                ? 'No orders found.'
                : 'No orders match the current filters.'}
            </div>
          ) : (
            pageSlice.map((order) => (
              <div key={order.id} className="admin-orders-row">
                <div className="admin-orders-col-check">
                  <Form.Check
                    type="checkbox"
                    checked={Boolean(selected[order.id])}
                    onChange={() => handleToggleRow(order.id)}
                    aria-label={`Select order ${shortOrderId(order.id)}`}
                  />
                </div>
                <div className="admin-orders-col-id admin-orders-mono text-muted">
                  {shortOrderId(order.id)}
                </div>
                <div className="admin-orders-col-date">{formatDateTime(order.date)}</div>
                <div className="admin-orders-col-grow fw-medium text-truncate">{order.customerID}</div>
                <div className="admin-orders-col-grow text-truncate">{order.accountRepresentativeID}</div>
                <div className="admin-orders-col-product text-truncate">{order.productID}</div>
                <div className="admin-orders-col-amount fw-medium">{formatAmount(order.amount)}</div>
                <div className="admin-orders-col-status">
                  <span className={statusPillClass(order.status)}>{order.status || '—'}</span>
                </div>
                <div className="admin-orders-col-actions admin-orders-row-actions">
                  <Link
                    to={`/admin/orders/${order.id}/edit`}
                    className="admin-icon-btn"
                    aria-label={`View or edit order ${shortOrderId(order.id)}`}
                  >
                    <IconEye />
                  </Link>
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      variant="link"
                      className="admin-icon-btn text-decoration-none p-1 border-0 shadow-none"
                      id={`order-more-${order.id}`}
                      aria-label={`More actions for order ${shortOrderId(order.id)}`}
                    >
                      <IconMoreVertical />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to={`/admin/orders/${order.id}/edit`}>
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="text-danger"
                        onClick={() => setDeleteTarget(order)}
                      >
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="admin-orders-footer">
          <span>
            Showing {fromIdx} to {toIdx} of {filtered.length} entries
          </span>
          <div className="d-flex align-items-center gap-1">
            <Button
              type="button"
              variant="outline-secondary"
              size="sm"
              disabled={pageCount === 0 || safePage <= 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline-secondary"
              size="sm"
              disabled={pageCount === 0 || safePage >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <Modal show={Boolean(deleteTarget)} onHide={() => !deleting && setDeleteTarget(null)} centered>
        <Modal.Body className="p-4">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <span className="admin-delete-modal-icon d-inline-flex align-items-center justify-content-center rounded-circle">
              <IconAlertTriangle />
            </span>
          </div>
          <h3 className="h5 fw-semibold text-center mb-2">
            Delete order {deleteTarget ? shortOrderId(deleteTarget.id) : ''}?
          </h3>
          <p className="text-muted small text-center mb-4">
            Are you sure you want to delete this order? This action cannot be undone and will remove all
            associated records.
          </p>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="outline-secondary" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete Order'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default OrderList;
