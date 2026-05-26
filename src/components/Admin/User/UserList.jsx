import React, { useState, useEffect, useCallback } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { graphqlQuery, graphqlMutation } from '../../../utils/graphqlClient';
import { listUsers } from '../../../graphql_custom';
import { deleteUser } from '../../../graphql_custom';
import { IconEdit2, IconTrash, IconUsers, IconPlus, IconRefresh } from '../icons/AdminIcons';
import { formatDateShort, formatDateTime, shortId } from '../../../utils/adminListFormat';

const legalAppsLabel = (user) => {
  const items = user.userLegalApps?.items ?? [];
  const names = items.map((item) => item.legalApp?.name).filter(Boolean);
  if (names.length === 0) return null;
  return names;
};

const LegalAppsPills = ({ names }) => {
  if (!names || names.length === 0) {
    return <span className="text-muted">—</span>;
  }
  const visible = names.slice(0, 2);
  const extra = names.length - visible.length;
  return (
    <div className="d-flex flex-wrap gap-1">
      {visible.map((name) => (
        <span key={name} className="admin-pill">
          {name}
        </span>
      ))}
      {extra > 0 ? (
        <span className="admin-pill text-muted">+{extra}</span>
      ) : null}
    </div>
  );
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = useCallback(async ({ silent } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    try {
      const result = await graphqlQuery(listUsers);
      setUsers(result.data.listUsers.items);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      if (silent) setRefreshing(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers({ silent: false });
  }, [fetchUsers]);

  const handleRefresh = () => {
    fetchUsers({ silent: true });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) {
      try {
        await graphqlMutation(deleteUser, { input: { id } });
        fetchUsers({ silent: true });
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('No se pudo eliminar el usuario.');
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
          <span className="fw-semibold text-body">Todos los usuarios</span>
          <span className="admin-data-count-pill" aria-label={`${users.length} usuarios`}>
            {users.length}
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

      {users.length > 0 ? (
        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apps legales</th>
                <th>Docs autoría</th>
                <th>Creado</th>
                <th>Actualizado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <span className="admin-orders-mono text-muted small" title={user.id}>
                      {shortId(user.id)}
                    </span>
                  </td>
                  <td>
                    <div className="fw-medium">{user.name}</div>
                  </td>
                  <td>
                    <LegalAppsPills names={legalAppsLabel(user)} />
                  </td>
                  <td>
                    <span className="admin-data-count-pill">
                      {user.legalDocs?.items?.length ?? 0}
                    </span>
                  </td>
                  <td className="text-muted">{formatDateShort(user.createdAt)}</td>
                  <td className="text-muted">{formatDateTime(user.updatedAt)}</td>
                  <td>
                    <div className="admin-table-actions">
                      <Link
                        to={`/admin/users/${user.id}/edit`}
                        className="admin-icon-btn"
                        aria-label={`Editar ${user.name}`}
                      >
                        <IconEdit2 />
                      </Link>
                      <button
                        type="button"
                        className="admin-icon-btn danger"
                        onClick={() => handleDelete(user.id)}
                        aria-label={`Eliminar ${user.name}`}
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

      {users.length === 0 ? (
        <div className="admin-empty-block">
          <div className="admin-empty-icon-wrap">
            <IconUsers />
          </div>
          <h2 className="h5 fw-semibold mb-2">No hay usuarios</h2>
          <p className="text-muted small mb-4 mx-auto admin-empty-copy">
            Añade usuarios y asígnalos a una o más aplicaciones legales para gestionar accesos y registros.
          </p>
          <Button
            as={Link}
            to="/admin/users/create"
            variant="outline-secondary"
            size="sm"
            className="d-inline-flex align-items-center gap-2"
          >
            <IconPlus />
            Nuevo usuario
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default UserList;
