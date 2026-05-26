import React, { useState, useEffect, useCallback } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { graphqlQuery, graphqlMutation } from '../../../utils/graphqlClient';
import { listLegalDocs, deleteLegalDoc } from '../../../graphql_custom';
import { IconEdit2, IconTrash, IconFileX, IconPlus, IconRefresh } from '../icons/AdminIcons';

const LegalDocList = () => {
  const [legalDocs, setLegalDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLegalDocs = useCallback(async ({ silent } = {}) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const result = await graphqlQuery(listLegalDocs);
      setLegalDocs(result.data.listLegalDocs.items);
    } catch (error) {
      console.error('Error loading legal docs:', error);
    } finally {
      if (silent) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchLegalDocs({ silent: false });
  }, [fetchLegalDocs]);

  const handleRefresh = () => {
    fetchLegalDocs({ silent: true });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this legal document?')) {
      try {
        await graphqlMutation(deleteLegalDoc, { input: { id } });
        fetchLegalDocs({ silent: true });
      } catch (error) {
        console.error('Error deleting legal doc:', error);
        alert('Error deleting legal document');
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5" role="status">
        <Spinner animation="border" />
        <span className="visually-hidden">Loading…</span>
      </div>
    );
  }

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  const typeName = (doc) => doc.legalDocType?.name || '—';
  const parentLabel = (doc) => {
    if (doc.legalDocParentID?.version) {
      return doc.legalDocParentID.version;
    }
    return '—';
  };

  return (
    <div className="admin-data-panel position-relative">
      {refreshing ? (
        <div
          className="position-absolute top-0 end-0 m-2 d-flex align-items-center gap-1 small text-muted"
          role="status"
          aria-live="polite"
        >
          <Spinner animation="border" size="sm" />
          <span className="visually-hidden">Refreshing list</span>
        </div>
      ) : null}

      <div className="admin-data-panel-toolbar">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="fw-semibold text-body">All documents</span>
          <span className="admin-data-count-pill" aria-label={`${legalDocs.length} documents`}>
            {legalDocs.length}
          </span>
        </div>
        <Button
          type="button"
          variant="outline-secondary"
          size="sm"
          className="d-inline-flex align-items-center gap-2"
          onClick={handleRefresh}
          disabled={refreshing}
          aria-label="Refresh list"
        >
          <IconRefresh />
          Refresh
        </Button>
      </div>

      {legalDocs.length > 0 ? (
        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Document Version</th>
                <th>Type</th>
                <th>Legal App</th>
                <th>Author</th>
                <th>Status</th>
                <th>Parent Doc</th>
                <th>Created At</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {legalDocs.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="fw-medium">{doc.version}</span>
                      {doc.is_latest ? (
                        <span className="admin-pill admin-pill-success">Latest</span>
                      ) : null}
                    </div>
                    <div className="small mt-1">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-link-muted text-break d-inline-block"
                      >
                        {doc.url.length > 56 ? `${doc.url.slice(0, 56)}…` : doc.url}
                      </a>
                    </div>
                  </td>
                  <td>
                    <span className="admin-pill">{typeName(doc)}</span>
                  </td>
                  <td>
                    {doc.legalApp?.name ? (
                      <span className="admin-pill">{doc.legalApp.name}</span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="text-muted">{doc.author?.name || '—'}</td>
                  <td>
                    {doc.isActive ? (
                      <span className="admin-pill admin-pill-success">Active</span>
                    ) : (
                      <span className="admin-pill admin-pill-warn">Inactive</span>
                    )}
                  </td>
                  <td className="text-muted">{parentLabel(doc)}</td>
                  <td className="text-muted">{formatDate(doc.createdAt)}</td>
                  <td>
                    <div className="admin-table-actions">
                      <Link
                        to={`/admin/legal-docs/${doc.id}/edit`}
                        className="admin-icon-btn"
                        aria-label={`Edit ${doc.version}`}
                      >
                        <IconEdit2 />
                      </Link>
                      <button
                        type="button"
                        className="admin-icon-btn danger"
                        onClick={() => handleDelete(doc.id)}
                        aria-label={`Delete ${doc.version}`}
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {legalDocs.length === 0 ? (
        <div className="admin-empty-block">
          <div className="admin-empty-icon-wrap">
            <IconFileX />
          </div>
          <h2 className="h5 fw-medium mb-2">No legal documents found</h2>
          <p className="text-muted small mb-4 mx-auto admin-empty-copy">
            Get started by creating a new legal document to manage your app compliance.
          </p>
          <Button
            as={Link}
            to="/admin/legal-docs/create"
            variant="outline-secondary"
            size="sm"
            className="d-inline-flex align-items-center gap-2"
          >
            <IconPlus />
            Create Document
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default LegalDocList;
