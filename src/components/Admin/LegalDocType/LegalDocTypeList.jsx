import React, { useState, useEffect, useCallback } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { graphqlQuery, graphqlMutation } from '../../../utils/graphqlClient';
import { listLegalDocTypes } from '../../../graphql/queries';
import { deleteLegalDocType } from '../../../graphql/mutations';
import { IconEdit2, IconTrash, IconFileType, IconPlus, IconRefresh } from '../icons/AdminIcons';
import { formatDateShort, shortId } from '../../../utils/adminListFormat';

const LegalDocTypeList = () => {
  const [docTypes, setDocTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDocTypes = useCallback(async ({ silent } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    try {
      const result = await graphqlQuery(listLegalDocTypes);
      setDocTypes(result.data.listLegalDocTypes.items);
    } catch (error) {
      console.error('Error loading doc types:', error);
    } finally {
      if (silent) setRefreshing(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocTypes({ silent: false });
  }, [fetchDocTypes]);

  const handleRefresh = () => {
    fetchDocTypes({ silent: true });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este tipo de documento? Esta acción no se puede deshacer.')) {
      try {
        await graphqlMutation(deleteLegalDocType, { input: { id } });
        fetchDocTypes({ silent: true });
      } catch (error) {
        console.error('Error deleting doc type:', error);
        alert('No se pudo eliminar el tipo de documento.');
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5" role="status">
        <Spinner animation="border" />
        <span className="visually-hidden">Cargando…</span>
      </div>
    );
  }

  return (
    <div className="admin-data-panel position-relative">
      {refreshing ? (
        <div
          className="position-absolute top-0 end-0 m-2 d-flex align-items-center gap-1 small text-muted"
          role="status"
          aria-live="polite"
        >
          <Spinner animation="border" size="sm" />
          <span className="visually-hidden">Actualizando lista</span>
        </div>
      ) : null}

      <div className="admin-data-panel-toolbar">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="fw-semibold text-body">Tipos de documento</span>
          <span className="admin-data-count-pill" aria-label={`${docTypes.length} tipos`}>
            {docTypes.length}
          </span>
        </div>
        <Button
          type="button"
          variant="outline-secondary"
          size="sm"
          className="d-inline-flex align-items-center gap-2"
          onClick={handleRefresh}
          disabled={refreshing}
          aria-label="Actualizar lista"
        >
          <IconRefresh />
          Actualizar
        </Button>
      </div>

      {docTypes.length > 0 ? (
        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Nombre corto</th>
                <th>Descripción</th>
                <th>Creado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {docTypes.map((docType) => (
                <tr key={docType.id}>
                  <td>
                    <span className="admin-orders-mono text-muted small" title={docType.id}>
                      {shortId(docType.id)}
                    </span>
                  </td>
                  <td>
                    <div className="fw-medium">{docType.name}</div>
                  </td>
                  <td>
                    {docType.shortName ? (
                      <span className="admin-pill">{docType.shortName}</span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="text-muted small">
                    {docType.description ? (
                      <span className="d-inline-block text-truncate admin-cell-desc-max" title={docType.description}>
                        {docType.description}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="text-muted">{formatDateShort(docType.createdAt)}</td>
                  <td>
                    <div className="admin-table-actions">
                      <Link
                        to={`/admin/legal-doc-types/${docType.id}/edit`}
                        className="admin-icon-btn"
                        aria-label={`Editar ${docType.name}`}
                      >
                        <IconEdit2 />
                      </Link>
                      <button
                        type="button"
                        className="admin-icon-btn danger"
                        onClick={() => handleDelete(docType.id)}
                        aria-label={`Eliminar ${docType.name}`}
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

      {docTypes.length === 0 ? (
        <div className="admin-empty-block">
          <div className="admin-empty-icon-wrap">
            <IconFileType />
          </div>
          <h2 className="h5 fw-semibold mb-2">No hay tipos de documento</h2>
          <p className="text-muted small mb-4 mx-auto admin-empty-copy">
            Define categorías (contratos, políticas, etc.) para clasificar tus documentos legales.
          </p>
          <Button
            as={Link}
            to="/admin/legal-doc-types/create"
            variant="outline-secondary"
            size="sm"
            className="d-inline-flex align-items-center gap-2"
          >
            <IconPlus />
            Nuevo tipo
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default LegalDocTypeList;
