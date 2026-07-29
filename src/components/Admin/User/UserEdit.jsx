import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { graphqlQuery, graphqlMutation } from '../../../utils/graphqlClient';
import {
  getUser,
  listLegalApps,
  updateUser,
  createUserLegalApp,
  deleteUserLegalApp,
} from '../../../graphql_custom';
import { IconArrowLeft } from '../icons/AdminIcons';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', legalAppIds: [] });
  const [initialJoinByLegalAppId, setInitialJoinByLegalAppId] = useState(new Map());
  const [legalApps, setLegalApps] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const result = await graphqlQuery(getUser, { id });
      const user = result.data.getUser;
      const joinItems = user.userLegalApps?.items ?? [];
      const joinMap = new Map(
        joinItems.map((item) => [item.legalApp.id, item.id]),
      );
      setInitialJoinByLegalAppId(joinMap);
      setFormData({
        name: user.name || '',
        legalAppIds: joinItems.map((item) => item.legalApp.id),
      });
      setLoadingData(false);
    } catch (err) {
      console.error('Error loading user:', err);
      setError('Error al cargar el usuario');
      setLoadingData(false);
    }
  }, [id]);

  const loadLegalApps = useCallback(async () => {
    try {
      const result = await graphqlQuery(listLegalApps);
      setLegalApps(result.data.listLegalApps.items);
    } catch (err) {
      console.error('Error loading legal apps:', err);
    }
  }, []);

  useEffect(() => {
    loadUser();
    loadLegalApps();
  }, [loadUser, loadLegalApps]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLegalAppToggle = (legalAppId) => {
    setFormData((prev) => {
      const ids = prev.legalAppIds.includes(legalAppId)
        ? prev.legalAppIds.filter((appId) => appId !== legalAppId)
        : [...prev.legalAppIds, legalAppId];
      return { ...prev, legalAppIds: ids };
    });
    setError('');
  };

  const reconcileUserLegalApps = async () => {
    const currentIds = new Set(formData.legalAppIds);
    const initialIds = new Set(initialJoinByLegalAppId.keys());

    const toCreate = [...currentIds].filter((appId) => !initialIds.has(appId));
    const toDelete = [...initialIds].filter((appId) => !currentIds.has(appId));

    await Promise.all([
      ...toCreate.map((legalAppId) =>
        graphqlMutation(createUserLegalApp, {
          input: {
            userUserLegalAppsId: id,
            legalAppUserLegalAppsId: legalAppId,
          },
        }),
      ),
      ...toDelete.map((legalAppId) =>
        graphqlMutation(deleteUserLegalApp, {
          input: { id: initialJoinByLegalAppId.get(legalAppId) },
        }),
      ),
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await graphqlMutation(updateUser, {
        input: { id, name: formData.name },
      });
      await reconcileUserLegalApps();
      navigate('/admin/users');
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.message || 'No se pudo actualizar el usuario.');
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" role="status">
        <Spinner animation="border" />
        <span className="visually-hidden">Cargando…</span>
      </div>
    );
  }

  return (
    <div className="admin-form-page">
      <Link to="/admin/users" className="admin-back-link">
        <IconArrowLeft />
        Volver a usuarios
      </Link>

      <h1 className="admin-page-title">Editar usuario</h1>
      <p className="admin-page-desc">
        Actualiza el nombre y las aplicaciones legales vinculadas a este usuario.
      </p>

      {error ? <Alert variant="danger" className="mt-3">{error}</Alert> : null}

      <Form className="mt-4" onSubmit={handleSubmit} noValidate>
        <div className="admin-form-card">
          <div className="admin-form-card-body admin-form-control-like">
            <Form.Group className="mb-4" controlId="user-name">
              <Form.Label className="small fw-medium text-body-secondary">Nombre *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Nombre completo o identificador"
                autoComplete="name"
              />
            </Form.Group>

            <Form.Group className="mb-0" controlId="user-legal-apps">
              <Form.Label className="small fw-medium text-body-secondary">Aplicaciones legales</Form.Label>
              {legalApps.length > 0 ? (
                <div className="d-flex flex-column gap-2 mt-2">
                  {legalApps.map((app) => (
                    <Form.Check
                      key={app.id}
                      type="checkbox"
                      id={`legal-app-edit-${app.id}`}
                      label={app.name}
                      checked={formData.legalAppIds.includes(app.id)}
                      onChange={() => handleLegalAppToggle(app.id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted small mb-0">No hay aplicaciones legales disponibles.</p>
              )}
              <Form.Text className="text-muted">
                Marca o desmarca apps para crear o eliminar vínculos usuario–aplicación.
              </Form.Text>
            </Form.Group>
          </div>

          <div className="admin-form-card-footer">
            <Button type="button" variant="outline-secondary" onClick={() => navigate('/admin/users')}>
              Cancelar
            </Button>
            <Button type="submit" variant="dark" className="shadow-sm" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" aria-hidden />
                  Guardando…
                </>
              ) : (
                'Guardar cambios'
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default UserEdit;
