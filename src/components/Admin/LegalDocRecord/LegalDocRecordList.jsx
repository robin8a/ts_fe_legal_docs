import React, { useState, useEffect, useCallback } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { graphqlQuery, graphqlMutation } from '../../../utils/graphqlClient';
import { listLegalDocRecords, deleteLegalDocRecord } from '../../../graphql_custom';
import { IconEdit2, IconTrash, IconCheckSquare, IconPlus, IconRefresh } from '../icons/AdminIcons';
import { formatDateShort, formatAwsTimestamp, shortId } from '../../../utils/adminListFormat';

const userLegalAppCell = (record) => {
  const ula = record.userLegalApp;
  if (!ula) {
    return <span className="text-muted">—</span>;
  }
  const userName = ula.user?.name;
  const appName = ula.legalApp?.name;
  if (!userName && !appName) {
    return (
      <span className="admin-orders-mono text-muted small">
        {shortId(record.userLegalAppLegalDocRecordsId)}
      </span>
    );
  }
  return (
    <div className="small">
      <div className="fw-medium">{userName ?? '—'}</div>
      <div className="text-muted">{appName ?? '—'}</div>
    </div>
  );
};

const LegalDocRecordList = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecords = useCallback(async ({ silent } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    try {
      const result = await graphqlQuery(listLegalDocRecords);
      setRecords(result.data.listLegalDocRecords.items);
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      if (silent) setRefreshing(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords({ silent: false });
  }, [fetchRecords]);

  const handleRefresh = () => {
    fetchRecords({ silent: true });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este registro de documento? Esta acción no se puede deshacer.')) {
      try {
        await graphqlMutation(deleteLegalDocRecord, { input: { id } });
        fetchRecords({ silent: true });
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('No se pudo eliminar el registro.');
      }
    }
  };

  const docLabel = (record) => record.legalDoc?.version || shortId(record.legalDocLegalDocRecordsId);

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
          <span className="fw-semibold text-body">Registros firmados</span>
          <span className="admin-data-count-pill" aria-label={`${records.length} registros`}>
            {records.length}
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

      {records.length > 0 ? (
        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Firma</th>
                <th>Fecha firma</th>
                <th>Usuario en app</th>
                <th>Documento</th>
                <th>Creado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>
                    <span className="admin-orders-mono text-muted small" title={record.id}>
                      {shortId(record.id)}
                    </span>
                  </td>
                  <td>
                    <span className="fw-medium">{record.sign}</span>
                  </td>
                  <td className="text-muted">{formatAwsTimestamp(record.legalSignDate)}</td>
                  <td>{userLegalAppCell(record)}</td>
                  <td>
                    <span className="admin-pill">{docLabel(record)}</span>
                  </td>
                  <td className="text-muted">{formatDateShort(record.createdAt)}</td>
                  <td>
                    <div className="admin-table-actions">
                      <Link
                        to={`/admin/legal-doc-records/${record.id}/edit`}
                        className="admin-icon-btn"
                        aria-label="Editar registro"
                      >
                        <IconEdit2 />
                      </Link>
                      <button
                        type="button"
                        className="admin-icon-btn danger"
                        onClick={() => handleDelete(record.id)}
                        aria-label="Eliminar registro"
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

      {records.length === 0 ? (
        <div className="admin-empty-block">
          <div className="admin-empty-icon-wrap">
            <IconCheckSquare />
          </div>
          <h2 className="h5 fw-semibold mb-2">No hay registros de documento</h2>
          <p className="text-muted small mb-4 mx-auto admin-empty-copy">
            Los registros vinculan una firma con un usuario en aplicación y una versión concreta del documento legal.
          </p>
          <Button
            as={Link}
            to="/admin/legal-doc-records/create"
            variant="outline-secondary"
            size="sm"
            className="d-inline-flex align-items-center gap-2"
          >
            <IconPlus />
            Nuevo registro
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default LegalDocRecordList;
