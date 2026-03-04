# Plan Real de Desacople (Inertia -> API REST)

## Contexto Revisado (codigo actual)
Se revisaron estas carpetas del backend:
- `app`
- `config`
- `routes`

Hallazgos clave del estado actual:
1. El backend esta orientado a Inertia en casi todos los modulos core:
   - `UsuarioController`, `RolController`, `ModuloController`, `InstitucionController`, `AuditoriaController`, `DashboardController` retornan `inertia(...)`.
2. Las rutas de negocio estan en `routes/web.php` + `routes/admin/*.php` con middleware `auth` + `acc.mod:*`.
3. `routes/api.php` hoy casi no tiene negocio:
   - `/user` (sanctum)
   - `/soap/usuarios`
4. El middleware de permisos `acc.mod` (`PermitirModuloAccion`) responde con vistas Inertia de error (`Errors/Denegado`), no JSON.
5. `HandleInertiaRequests` inyecta datos globales (`auth`, `sidebar`, `permisos`, `flash`, config sistema), lo que acopla fuerte las paginas a Inertia.
6. Ya existe buena base para REST:
   - modelo `Usuario` como autenticable real
   - `sanctum.php` configurado
   - `StoreUsuarioRequest`, `UpdateUsuarioRequest`, `UsuarioResource`

## Objetivo de esta fase (sin Tauri todavia)
Desacoplar el frontend del monolito Inertia y mover negocio a API REST, manteniendo la app web operativa durante toda la transicion.

Regla de esta fase:
- NO eliminar Inertia de golpe.
- Crear capa API en paralelo y migrar frontend modulo por modulo.

## Estrategia recomendada (hibrida, sin romper)

### 1) Separar capas por tipo de controller
Mantener controladores web actuales y crear controladores API nuevos:
- Web/Inertia: `app/Http/Controllers/*` (compatibilidad temporal)
- API REST: `app/Http/Controllers/Api/V1/*`

No mezclar `inertia()` y `response()->json()` en el mismo controller.

### 2) Llevar la logica de negocio a servicios de aplicacion
Evitar duplicacion entre Web e API extrayendo casos de uso:
- `app/Domain/Usuarios/Services/*`
- `app/Domain/Roles/Services/*`
- `app/Domain/Modulos/Services/*`
- `app/Domain/Instituciones/Services/*`
- `app/Domain/Auditorias/Services/*`

Web controllers y API controllers consumen el mismo servicio.

### 3) Crear middleware API de permisos (JSON)
No reutilizar `PermitirModuloAccion` tal cual para API porque hoy devuelve Inertia.
Crear middleware dedicado, por ejemplo:
- `App\Http\Middleware\ApiPermitirModuloAccion`

Respuesta estandar cuando no tenga permiso:
```json
{
  "success": false,
  "message": "Acceso denegado",
  "errors": {
    "code": "forbidden"
  }
}
```

### 4) Estandarizar contrato de respuesta API
Usar una forma unica para todos los endpoints:
```json
{
  "success": true,
  "message": "OK",
  "data": {},
  "meta": {}
}
```

Errores de validacion:
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "campo": ["mensaje"]
  }
}
```

## Rutas API objetivo (`/api/v1`)

### Auth
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

### Core
- `GET /api/v1/dashboard/resumen`
- `GET /api/v1/usuarios`
- `POST /api/v1/usuarios`
- `GET /api/v1/usuarios/{id}`
- `PUT /api/v1/usuarios/{id}`
- `PATCH /api/v1/usuarios/{id}/activo`
- `PATCH /api/v1/usuarios/{id}/estado`
- `GET /api/v1/roles`
- `POST /api/v1/roles`
- `PUT /api/v1/roles/{id}`
- `PATCH /api/v1/roles/{id}/activo`
- `GET /api/v1/modulos`
- `POST /api/v1/modulos`
- `GET /api/v1/modulos/{id}`
- `PUT /api/v1/modulos/{id}`
- `PATCH /api/v1/modulos/{id}/activo`
- `DELETE /api/v1/modulos/{id}`
- `GET /api/v1/instituciones`
- `POST /api/v1/instituciones`
- `PUT /api/v1/instituciones/{id}`
- `GET /api/v1/auditorias`

## Plan por fases (ejecutable)

### Fase A - Fundacion API (sin tocar UI aun)
- [x] Crear namespace `Api/V1` para controladores.
- [x] Crear `routes/api_v1.php` e incluirlo desde `routes/api.php`.
- [x] Crear `ApiResponse` helper/trait para respuesta uniforme.
- [x] Crear middleware `api.acc.mod` (JSON) y registrarlo en `bootstrap/app.php`.
- [ ] Definir `config/frontend.php` con feature flags por modulo (`rest_usuarios`, `rest_roles`, etc.).

### Fase B - Auth API primero
- [x] Implementar `AuthApiController@login/logout/me` con Sanctum.
- [x] Mantener `LoginController` web actual intacto.
- [x] Probar sesion web + token api coexistiendo.

### Fase C - Migracion de modulos core a REST
Orden recomendado por complejidad y dependencia:
1. Instituciones
2. Roles
3. Usuarios
4. Modulos
5. Auditorias
6. Dashboard

Por cada modulo:
- [ ] crear controller API + resource + request
- [ ] aplicar `auth:sanctum` + `api.acc.mod`
- [ ] mover logica comun a servicio de dominio
- [ ] agregar paginacion (no `get()` masivo para tablas grandes)
- [ ] registrar auditoria desde servicio (no duplicada)

### Fase D - Frontend hibrido (sin romper)
- [x] Crear cliente HTTP unico en `resources/js/shared/lib/api-client.js`.
- [x] Crear servicios por dominio en `resources/js/core/*/services`.
- [x] En cada pagina migrada, reemplazar Inertia POST/PUT/PATCH por API REST.
- [x] Mantener `usePage()` solo para datos aun no migrados.
- [ ] Activar por flag de modulo para rollback rapido.

### Fase E - Retiro final de Inertia
Solo cuando todos los modulos core esten migrados:
- [ ] quitar resolucion Inertia en `resources/js/app.jsx`
- [ ] limpiar `HandleInertiaRequests`
- [ ] dejar `routes/web.php` solo para shell/autenticacion/base
- [ ] mover errores de autorizacion a manejo API + frontend SPA

## Riesgos reales detectados en tu base
1. **Permisos acoplados a Inertia**
   - `PermitirModuloAccion` hoy devuelve paginas Inertia.
   - Mitigacion: middleware paralelo JSON para API.

2. **Consultas sin paginacion en listados**
   - Ej: `Usuario::...->get()`, `Auditoria::...->get()`.
   - Mitigacion: usar `paginate()` en endpoints REST.

3. **Duplicacion de reglas/validaciones**
   - Varios controladores validan inline.
   - Mitigacion: centralizar en `FormRequest` de API + servicios dominio.

4. **Dependencia de props globales de Inertia**
   - `sidebar`, `permisos`, `flash` vienen del middleware global.
   - Mitigacion: exponer endpoints dedicados:
     - `GET /api/v1/auth/me`
     - `GET /api/v1/navigation/sidebar`
     - `GET /api/v1/auth/permisos`

## Definition of Done de esta etapa
- [x] Existe API `/api/v1` funcional para al menos 2 modulos core.
- [x] Frontend web consume REST en esos modulos sin romper login actual.
- [x] Permisos API responden JSON consistente.
- [ ] Sin regresiones en rutas `web.php` existentes.

## Proxima ejecucion sugerida (inmediata)
1. Crear estructura base API v1 + middleware `api.acc.mod`.
2. Implementar `auth/me` + `instituciones` REST.
3. Adaptar frontend de instituciones para consumir REST por feature flag.
4. Validar y repetir patron en roles/usuarios.
