# Shoes Store — Monorepo

Aplicación de gestión para tienda de zapatos. Este repositorio contiene tanto el backend como el frontend en un monorepo con npm workspaces.

## Estructura

```text
/
├── backend/     # API REST con Express + TypeScript + Mongoose
├── frontend/    # Aplicación React + TypeScript + Vite
├── package.json # Workspaces root
└── README.md
```

## Requisitos

- Node.js (versión LTS recomendada)
- MongoDB (local o remoto)

## Configuración

1. Copia `backend/.env.example` a `backend/.env` y completa las variables:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/shoes-store
   JWT_SECRET=tu_clave_secreta
   FRONTEND_URL=http://localhost:5173
   ```

2. Instala las dependencias de todos los workspaces:

   ```bash
   npm install
   ```

## Comandos

```bash
# Desarrollo (backend y frontend en paralelo)
npm run dev

# Build de ambos workspaces
npm run build

# Build individual
npm run build --workspace=backend
npm run build --workspace=frontend

# Iniciar backend compilado
npm run start --workspace=backend

# Crear el primer administrador
npm run seed:admin --workspace=backend
```

## URLs de desarrollo

- Backend: http://localhost:3000
- Frontend: http://localhost:5173

El frontend se comunica con el backend a través del proxy de Vite (`/api` -> `http://localhost:3000`).

## Funcionalidades

### Públicas

- Catálogo de productos y categorías.
- Registro e inicio de sesión de clientes.

### Customer

- Agregar productos al carrito por talla y color.
- Realizar checkout y ver historial de pedidos.

### Admin

- Gestión de productos, categorías y usuarios.
- Registro de movimientos de inventario.
- Visualización de ventas.

## Documentación

La documentación original del backend se encuentra en `backend/docs/`.

## Convenciones

- Código en inglés.
- UI y documentación de negocio en español.
- Backend organizado por capas: `model → repository → service → controller → routes`.
- Frontend organizado por funcionalidades (`features/`).
