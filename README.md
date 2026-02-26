# 🏗️ Línea Base TRZ – Plataforma Base de Trazabilidad

**Línea Base TRZ** es la plataforma base desarrollada por el área de operaciones de Casa de Moneda de Chile. Provee la infraestructura administrativa fundamental (autenticación, gestión de usuarios, roles, permisos, módulos y auditoría) sobre la cual se construyen los sistemas de trazabilidad y digitalización de procesos productivos.

---

## 🔎 ¿Qué provee Línea Base?

- Sistema de autenticación dual (LDAP internos / email externos)
- Gestión de usuarios con estados, activación y bloqueo
- Control de acceso basado en roles (RBAC) granular
- Gestión dinámica de módulos y acciones
- Registro de auditoría de todas las acciones del sistema
- Gestión de instituciones externas
- Sidebar dinámica generada por permisos del rol
- Soporte para dark/light mode

---

## 🧩 Módulos incluidos

- **Gestión de Usuarios** – CRUD, activación/desactivación, reset de contraseña con OTP
- **Gestión de Roles** – Creación de roles con asignación granular de permisos
- **Gestión de Módulos** – Configuración dinámica de módulos y sus acciones
- **Auditoría** – Registro y consulta de todas las acciones realizadas
- **Instituciones** – Gestión de entidades externas asociadas

---

## 🧱 Tecnologías

| Capa | Stack |
|------|-------|
| **Backend** | Laravel 12 (PHP 8.2+) |
| **Frontend Bridge** | Inertia.js 2.x |
| **Frontend** | React 18 + ShadCN (Radix UI) |
| **Estilos** | Tailwind CSS 4.x |
| **Formularios** | react-hook-form + Zod |
| **Tablas** | @tanstack/react-table |
| **Gráficos** | Recharts |
| **Bundler** | Vite 6.x |
| **Base de Datos** | MySQL |
| **Autenticación** | LDAP + password local |

---

## 🚀 Instalación

```bash
# Instalar dependencias PHP
composer install

# Instalar dependencias JS
npm install

# Configurar entorno
cp .env.example .env
php artisan key:generate

# Ejecutar migraciones y seeders
php artisan migrate --seed

# Iniciar en desarrollo
composer dev
```

---

## 📜 Licencia

Línea Base TRZ es un sistema de uso interno de Casa de Moneda de Chile. No está autorizado su uso externo o reproducción sin permiso explícito.
