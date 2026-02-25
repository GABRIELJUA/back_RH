# Uso de filtros globales, paginación y auditoría

Este documento resume cómo consumir los filtros/paginación agregados y cómo activar la trazabilidad con `audit_log`.

## 1) Filtros y paginación

La paginación es **opcional** y se activa enviando `page` y/o `limit`.

- Si no envías paginación: el endpoint responde arreglo normal.
- Si envías paginación: el endpoint responde objeto:

```json
{
  "data": [],
  "total": 0,
  "page": 1,
  "limit": 10,
  "totalPages": 0
}
```

### Empleados
`GET /api/employees`

Query params soportados:
- `departamento`
- `puesto`
- `estatus` (rol exacto)
- `roles` (lista CSV de roles, por ejemplo `ADMIN,ADMIN_EDITOR`)
- `q` (búsqueda por nombre/apellidos/nómina)
- `page`, `limit`

Ejemplos:
- `/api/employees?departamento=RH&puesto=Recepcion&q=juan&page=1&limit=10`
- `/api/employees?roles=ADMIN,ADMIN_EDITOR,ADMIN_LECTURA&page=1&limit=10`

### Usuarios del sistema (IAM)
`GET /api/employees/system-users`

Este endpoint devuelve únicamente cuentas con rol de acceso al sistema:
- `ADMIN`
- `ADMIN_EDITOR`
- `ADMIN_LECTURA`

Query params soportados:
- `q` (búsqueda por nombre/apellidos/nómina)
- `page`, `limit`

Ejemplo:
`/api/employees/system-users?q=ana&page=1&limit=10`

### Comunicados
`GET /api/comunicados` y `GET /api/comunicados/public`

Query params soportados:
- `fecha_desde` (YYYY-MM-DD)
- `fecha_hasta` (YYYY-MM-DD)
- `categoria` (match textual en título/contenido)
- `q` (match textual en título/contenido)
- `page`, `limit`

Ejemplo:
`/api/comunicados?fecha_desde=2026-01-01&fecha_hasta=2026-12-31&categoria=operativo&page=1&limit=10`

### Biblioteca
`GET /api/library`

Query params soportados:
- `categoria`
- `q` (título/descripcion)
- `page`, `limit`

Ejemplo:
`/api/library?categoria=manuales&q=induccion&page=1&limit=10`

## 2) Auditoría y trazabilidad

Para activar trazabilidad en MySQL, ejecutar:

- `docs/sql/audit_log.sql`

Si la tabla no existe aún, el backend **no rompe flujo** y emite warning controlado.

Se registran acciones de:
- Empleados: crear, actualizar, actualizar perfil, cambiar rol.
- Comunicados: crear, actualizar, eliminar.
- Biblioteca: subir, eliminar.
- Vacaciones: crear solicitud.

Campos principales de `audit_log`:
- `user_id`
- `action`
- `entity`
- `entity_id`
- `details` (JSON)
- `created_at`
