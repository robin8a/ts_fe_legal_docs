# Migración Amplify Gen 1 → Gen 2 (`gen2-migration`)

Proyecto: **tsbelegaldocsapi** · Entorno actual: **`dev`** · App ID: **`d1h0lpobqmskz4`** · Región: **`us-east-1`**

Documentación oficial: [Migrate an existing Gen 1 Environment to Gen 2](https://docs.amplify.aws/react/start/migrate-to-gen2/migrate-existing-app/)

---

## Resultado del assessment (ejecutado localmente)

| Categoría | Recurso | Generate | Refactor |
|-----------|---------|----------|----------|
| api / AppSync | `tsbelegaldocsapi` | ✔ | — (no aplica, stateless) |
| auth / Cognito | `tsbelegaldocsapia927c727` | ✔ | ✔ |

**Conclusión:** el backend actual es candidato a migración automatizada con la herramienta oficial.

`amplify status` en `dev` reporta **No Change** en Auth y Api (local alineado con lo desplegado).

---

## Advertencias específicas de este repo

1. **Cognito importado** (`serviceType: "imported"`): el User Pool e Identity Pool pertenecen al proyecto **tsbeoraculoapi** (`us-east-1_chqNtZEAP`). El refactor moverá la gestión CloudFormation al stack Gen 2; cualquier otro front que use el mismo pool puede verse afectado. Coordinar con el equipo de Oráculo antes de `refactor` en entornos compartidos.

2. **Auth pública en GraphQL** (`allow: public`, API_KEY): tras `generate`, revisar `amplify/data/resource.ts` y mantener reglas `@auth` explícitas equivalentes a Gen 1.

3. **Tabla puente `UserLegalApp`**: se generará como modelo Gen 2; no requiere cambios manuales por N:M.

4. **No ejecutar `lock` / `refactor` en producción** sin haber validado antes en un clon o en `dev` con pipelines desactivados.

5. **`generate` sobrescribe `./amplify/`** con código Gen 2. Conservar Gen 1 con backup o rama Git antes de generar.

---

## Requisitos previos

### Herramientas

```bash
# CLI Gen 1 con subcomando gen2-migration (mínimo 14.4)
npm install -g @aws-amplify/cli@^14.5.0
amplify --version   # debe ser >= 14.4.0

node -v             # >= 20
```

> En CLI **14.2.x** el comando `gen2-migration` **no existe**. Actualizar antes de continuar.

### AWS

- Perfil con permisos Amplify habituales **más** acciones de Stack Refactor (`cloudformation:CreateStackRefactor`, `ExecuteStackRefactor`, etc.). Ver [política IAM en la guía oficial](https://docs.amplify.aws/react/start/migrate-to-gen2/migrate-existing-app/#aws-credentials).
- Cuenta/región con **CDK bootstrap** (`cdk bootstrap aws://ACCOUNT/REGION`).

### Repositorio

- Commitear o hacer stash de cambios locales antes de `generate` (el comando exige working tree limpio).
- Rama recomendada para Gen 2: `gen2-dev` (o reutilizar `amplify-upgrade-to-gen2`).

### Frontend (fase posterior al primer deploy Gen 2)

- Subir `aws-amplify` de **v5** → **v6.16.2+**
- Sustituir `aws-exports` por `amplify_outputs.json` cuando el hosting/sandbox lo genere
- TypeScript del proyecto: hoy **4.9.5**; Gen 2 generado usa TS 5+ (solo en carpeta `amplify/` Gen 2)

### Hosting

- Actualizar imagen de build a **Amazon Linux 2023** (ver `AMPLIFY_BUILD_SETUP.md`).
- Tras `generate`, el tool crea un `amplify.yml` compatible con Gen 2; revisar diff antes de merge.

---

## Flujo recomendado (entorno `dev`)

### Fase 0 — Preparación

```bash
cd e:/DEV/SUAN/ts_fe_legal_docs
amplify pull --appId d1h0lpobqmskz4 --envName dev
amplify status    # sin cambios pendientes
git status        # limpio antes de generate
npm run migrate:assess
```

Opcional (recomendado por AWS): clonar entorno solo si puedes **aislar** Cognito importado; con auth compartido, validar en `dev` y desactivar auto-deploy de Amplify Console.

### Fase 1 — Lock

Congela updates en el stack Gen 1 `dev`. Desactivar pipelines que hagan `amplify push` a `dev`.

```bash
npm run migrate:lock
```

Desbloquear (solo si **no** hiciste refactor):

```bash
amplify gen2-migration lock --rollback
```

### Fase 2 — Generate

> **Windows (proyecto en `E:`):** el CLI genera en `%TEMP%` (suele ser `C:`) y falla al mover `amplify/` con `EXDEV: cross-device link not permitted`. Fuerza temp en la misma unidad **antes** de `generate`:
>
> ```bash
> mkdir -p .tmp
> export TMP="$PWD/.tmp"
> export TEMP="$PWD/.tmp"
> export TMPDIR="$PWD/.tmp"
> amplify gen2-migration generate --skip-validations
> ```
>
> Si el comando falla a mitad, restaurar con `git restore amplify/ .gitignore amplify.yml package.json`.

```bash
git checkout -b gen2-dev
# Asegurar working tree limpio
amplify gen2-migration generate --skip-validations
```

Post-generate obligatorio para este proyecto:

1. **`amplify/data/resource.ts`**: ajustar `branchName` al nombre de la rama Gen 2 (p. ej. `"gen2-dev"`) para reutilizar tablas DynamoDB de modelos.
2. Revisar `@auth(rules: [{ allow: public }])` en todos los tipos que hoy son públicos.
3. Revisar `amplify/auth/resource.ts` si usáis Hosted UI (callback URLs Gen 1 + Gen 2).

Limpieza de dependencias tras generate (según guía AWS):

```bash
rm -rf node_modules package-lock.json
npm install
```

### Fase 3 — Deploy Gen 2 vía Amplify Hosting (recomendado; sin sandbox)

El **sandbox** no conviene para reutilizar tablas Gen 1 (conflicto CloudFormation). Usar **Hosting** con rama **`dev`** y `branchName: 'dev'` en `amplify/data/resource.ts`.

1. `amplify.yml` incluye fase `backend` con `npx ampx pipeline-deploy`.
2. Commit + push a la rama que Amplify Console construye como **`dev`**.
3. En consola: app `d1h0lpobqmskz4` → rama `dev` → build (Amazon Linux 2023, Node ≥ 20).
4. Tras el build, descargar o usar `amplify_outputs.json` del artefacto / consola.
5. Probar `listLegalApps` en la API Gen 2 y comparar con Gen 1.

**No usar** `npx ampx sandbox` para validar datos compartidos con Gen 1.

### Fase 4 — Refactor (irreversible para updates Gen 1)

Solo cuando Gen 2 esté validado:

```bash
amplify gen2-migration refactor
```

Tras refactor, **no** volver a hacer `amplify push` en Gen 1.

### Fase 5 — Frontend

1. Actualizar dependencias (`aws-amplify@^6.16.2`).
2. Cambiar configuración en `src/index.js` (o equivalente) a `amplify_outputs.json`.
3. Desplegar front apuntando a recursos stateless Gen 2.

---

## Comandos npm (este repo)

| Script | Acción |
|--------|--------|
| `npm run migrate:assess` | Informe generate/refactor |
| `npm run migrate:lock` | Bloquear env `dev` |
| `npm run migrate:lock:rollback` | Desbloquear |
| `npm run migrate:generate` | Generar código Gen 2 (requiere lock + git limpio) |

---

## Checklist rápido

- [ ] CLI >= 14.4.0
- [ ] `migrate:assess` sin recursos ✘
- [ ] Equipo avisado (Cognito compartido con Oráculo)
- [ ] Pipelines Gen 1 pausados
- [ ] `migrate:lock`
- [ ] Rama `gen2-dev` + git limpio + `migrate:generate`
- [ ] Edits post-generate (auth pública, `branchName`)
- [ ] Deploy rama Gen 2 y pruebas E2E
- [ ] `refactor`
- [ ] Upgrade frontend v6 + `amplify_outputs.json`

---

## Rollback

- Antes de **refactor**: `lock --rollback` y seguir en Gen 1.
- Después de **refactor**: usar `refactor --rollback` según guía AWS (ventana limitada; stacks Gen 1 se conservan temporalmente).

---

## Referencias

- [Feature matrix](https://docs.amplify.aws/react/start/migrate-to-gen2/feature-matrix/)
- [v5 → v6 cliente JS](https://docs.amplify.aws/gen1/javascript/build-a-backend/troubleshooting/migrate-from-javascript-v5-to-v6/)
- [GitHub #14490 — discusión migración](https://github.com/aws-amplify/amplify-cli/discussions/14490)
