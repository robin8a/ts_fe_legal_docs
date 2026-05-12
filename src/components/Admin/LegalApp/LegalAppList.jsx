import React, { useState, useEffect, useCallback } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { graphqlQuery, graphqlMutation } from '../../../utils/graphqlClient';
import { listLegalApps } from '../../../graphql/queries';
import { deleteLegalApp } from '../../../graphql/mutations';
import { IconEdit2, IconTrash, IconLayoutGrid, IconPlus, IconRefresh } from '../icons/AdminIcons';
import { formatDateShort, shortId } from '../../../utils/adminListFormat';

const LegalAppList = () => {
  const [legalApps, setLegalApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLegalApps = useCallback(async ({ silent } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    try {
      const result = await graphqlQuery(listLegalApps);
      setLegalApps(result.data.listLegalApps.items);
    } catch (error) {
      console.error('Error loading legal apps:', error);
    } finally {
      if (silent) setRefreshing(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLegalApps({ silent: false });
  }, [fetchLegalApps]);

  const handleRefresh = () => {
    fetchLegalApps({ silent: true });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar esta aplicación legal? Esta acción no se puede deshacer.')) {
      try {
        await graphqlMutation(deleteLegalApp, { input: { id } });
        fetchLegalApps({ silent: true });
      } catch (error) {
        console.error('Error deleting legal app:', error);
        alert('No se pudo eliminar la aplicación.');
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
          <span className="fw-semibold text-body">Todas las apps</span>
          <span className="admin-data-count-pill" aria-label={`${legalApps.length} aplicaciones`}>
            {legalApps.length}
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

      {legalApps.length > 0 ? (
        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Creado</th>
                <th>Actualizado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {legalApps.map((app) => (
                <tr key={app.id}>
                  <td>
                    <span className="admin-orders-mono text-muted small" title={app.id}>
                      {shortId(app.id)}
                    </span>
                  </td>
                  <td>
                    <div className="fw-medium">{app.name}</div>
                  </td>
                  <td className="text-muted">{formatDateShort(app.createdAt)}</td>
                  <td className="text-muted">{formatDateShort(app.updatedAt)}</td>
                  <td>
                    <div className="admin-table-actions">
                      <Link
                        to={`/admin/legal-apps/${app.id}/edit`}
                        className="admin-icon-btn"
                        aria-label={`Editar ${app.name}`}
                      >
                        <IconEdit2 />
                      </Link>
                      <button
                        type="button"
                        className="admin-icon-btn danger"
                        onClick={() => handleDelete(app.id)}
                        aria-label={`Eliminar ${app.name}`}
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

      {legalApps.length === 0 ? (
        <div className="admin-empty-block">
          <div className="admin-empty-icon-wrap">
            <IconLayoutGrid />
          </div>
          <h2 className="h5 fw-semibold mb-2">No hay aplicaciones legales</h2>
          <p className="text-muted small mb-4 mx-auto admin-empty-copy">
            Crea una app para asociar usuarios, documentos y pedidos en un solo espacio.
          </p>
          <Button
            as={Link}
            to="/admin/legal-apps/create"
            variant="outline-secondary"
            size="sm"
            className="d-inline-flex align-items-center gap-2"
          >
            <IconPlus />
            Nueva aplicación
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default LegalAppList;
