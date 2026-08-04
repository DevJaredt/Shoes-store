# Shoes Store — Guía para Agentes de Código

Este documento resume la arquitectura, convenciones y flujo de trabajo del proyecto **Shoes Store**. Está escrito para agentes de IA que no conozcan el contexto del negocio ni la estructura del código.

> **Idioma del proyecto:** el código, variables y nombres de archivos están en inglés. La documentación de negocio (`ProyectContext.txt`) y los mensajes de error de algunos módulos están en español. Esta guía se redacta en español para mantener coherencia con el contexto de negocio dominante.

> **Regla de oro para agentes:** antes de crear, modificar o eliminar cualquier archivo, consultar el grafo de trazabilidad del proyecto en `.agents/project-graph.json` y `.agents/project-graph.md`. Después de cualquier cambio arquitectónico, actualizar ambos archivos. El grafo es el cerebro del proyecto y debe mantenerse consistente.

---

## 1. Visión general del proyecto

Shoes Store es el backend de un sistema de gestión para una tienda de zapatos. El objetivo del MVP es reemplazar el control manual de inventario, ventas, clientes y vendedores por una aplicación organizada y trazable.

Alcance actual del backend:

- Autenticación con JWT y roles (`admin` y `customer`).
- Registro público de clientes (`customer`).
- Gestión de usuarios con datos de contacto (documento y teléfono).
- Gestión de categorías (CRUD completo con eliminación lógica).
- Gestión de productos (CRUD), donde cada producto tiene variantes por talla, color y stock, y precio de compra para cálculo de ganancias.
- Catálogo público de productos y categorías.
- Registro de compras/ventas con descuento automático de stock y snapshot de precios.
- Movimientos de inventario (entradas, salidas, ajustes) con trazabilidad completa, gestionados por admin.
- Conexión a MongoDB con Mongoose e índices estratégicos.
- API REST con Express + TypeScript.
- Seed para crear el primer administrador (`src/seedAdmin.ts`).

Lo que aún **no está implementado** (según el contexto de negocio):

- Reportes (ventas del día/mes, productos más vendidos, ganancias, inventario bajo).
- Frontend (la arquitectura sugerida es React, pero no existe en este repositorio).
- Docker.

---

## 2. Stack tecnológico

| Capa | Tecnología |
| --- | --- |
| Lenguaje | TypeScript 7.x |
| Runtime | Node.js |
| Framework web | Express 5.x |
| Base de datos | MongoDB (vía Mongoose 9.x) |
| Autenticación | JWT + bcryptjs |
| Variables de entorno | `dotenv` |
| Ejecución en desarrollo | `tsx watch` |
| Compilación | `tsc` |

Dependencias principales (ver `package.json`):

- `express`
- `mongoose`
- `dotenv`
- `jsonwebtoken`
- `bcryptjs`

Dependencias de desarrollo:

- `typescript`
- `tsx`
- `@types/express`
- `@types/node`
- `@types/jsonwebtoken`
- `@types/bcryptjs`

---

## 3. Estructura de carpetas

```text
src/
├── app.ts                          # Configura Express y monta las rutas
├── seedAdmin.ts                    # Crea el primer administrador
├── server.ts                       # Inicia el servidor y conecta la base de datos
└── app/
    ├── controllers/                # Manejadores HTTP (Request/Response)
    │   ├── AuthController.ts
    │   ├── CategoryController.ts
    │   ├── InventoryMovementController.ts
    │   ├── ProductController.ts
    │   ├── SaleController.ts
    │   └── UserController.ts
    ├── database/
    │   └── connection.ts           # Conexión a MongoDB con Mongoose
    ├── middleware/
    │   └── auth.ts                 # Autenticación JWT y autorización por roles
    ├── models/                     # Esquemas y modelos de Mongoose + interfaces
    │   ├── CategoryModel.ts
    │   ├── InventoryMovementModel.ts
    │   ├── ProductModel.ts
    │   ├── SaleModel.ts
    │   └── UserModel.ts
    ├── repositories/               # Acceso directo a la base de datos
    │   ├── CategoryRepository.ts
    │   ├── InventoryMovementRepository.ts
    │   ├── ProductRepository.ts
    │   ├── SaleRepository.ts
    │   └── UserRepository.ts
    ├── routes/                     # Definición de rutas Express
    │   ├── AuthRoutes.ts
    │   ├── CategoryRoutes.ts
    │   ├── InventoryMovementRoutes.ts
    │   ├── ProductRoutes.ts
    │   ├── SaleRoutes.ts
    │   └── UserRoutes.ts
    └── services/                   # Lógica de negocio
        ├── AuthService.ts
        ├── CategoryService.ts
        ├── InventoryMovementService.ts
        ├── ProductService.ts
        ├── SaleService.ts
        └── UserService.ts

.agents/                            # Memoria y grafo de trazabilidad del proyecto
├── project-graph.json              # Grafo estructurado (machine-readable)
└── project-graph.md                # Grafo documentado con diagramas Mermaid

docs/                               # Documentación del proyecto
├── API.md                          # Referencia de endpoints
├── MODELS.md                       # Esquemas de datos e índices
└── TESTING_MANUAL.md               # Guía de pruebas manuales con cURL
```

Arquitectura: **capas clásicas** Controller → Service → Repository → Model. No se usa inyección de dependencias; los servicios y repositorios se exportan como instancias singleton.

---

## 4. Configuración y entorno

### Variables de entorno

El proyecto requiere un archivo `.env` en la raíz. El archivo `.env.example` documenta las variables esperadas:

```env
PORT=
MONGODB_URI=
JWT_SECRET=

# Opcional: credenciales para el seed del administrador
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_DOCUMENT=
ADMIN_PHONE=
```

- `PORT`: puerto del servidor (por defecto `3000` si no está definido).
- `MONGODB_URI`: URI de conexión a MongoDB.
- `JWT_SECRET`: clave secreta para firmar tokens JWT.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_DOCUMENT`, `ADMIN_PHONE`: credenciales opcionales para el seed del primer administrador. Si no se configuran, usa valores por defecto.

> **Nota de seguridad:** `.env` está ignorado en `.gitignore`. Nunca subas credenciales al repositorio.

### TypeScript

Configuración en `tsconfig.json`:

- `target`: `ES2022`
- `module`: `NodeNext`
- `moduleResolution`: `NodeNext`
- `rootDir`: `./src`
- `outDir`: `./dist`
- `strict`: `true`
- `esModuleInterop`: `true`

---

## 5. Comandos disponibles

Los scripts están definidos en `package.json`:

```bash
# Desarrollo con recarga en caliente
npm run dev

# Compilar TypeScript a la carpeta dist/
npm run build

# Iniciar la aplicación compilada
npm start
```

> **Nota:** el script `start` apunta correctamente a `node dist/server.js`.

---

## 6. Convenciones de código

### Idioma y nombres

- Archivos, clases, variables y funciones en **inglés** (p. ej., `ProductController`, `CategoryService`).
- Interfaces de Mongoose prefijadas con `I` (p. ej., `IProduct`, `ICategory`).
- Modelos de Mongoose exportados como `ModelName` (p. ej., `ProductModel`, `CategoryModel`).
- Repositorios y servicios se exportan como instancias singleton: `productRepository`, `categoryService`, etc.

### Estilo de controllers

Actualmente hay **dos estilos** conviviendo:

1. **Funciones sueltas** (`ProductController.ts`): cada handler es una función exportada por nombre.
2. **Clase + instancia singleton** (`CategoryController.ts`): los handlers son métodos de una clase instanciada al final del archivo.

Ambos funcionan, pero evita mezclar ambos estilos dentro de un mismo módulo nuevo. Si agregas un nuevo dominio, sigue el estilo de `CategoryController` (clase con instancia exportada) porque es más reciente y escalable.

### Respuestas HTTP

- `ProductController` envuelve respuestas en `{ success: boolean, data/message }`.
- `CategoryController` devuelve directamente el documento o un mensaje.

Cuando agregues nuevos endpoints, elige un formato consistente y aplícalo a todo el proyecto.

### Repositorios

- `CategoryRepository` incluye soft delete (`active: false`) y usa `runValidators: true` en actualizaciones.
- `ProductRepository` permite eliminación física (`findByIdAndDelete`) y actualización con `returnDocument: "after"`.

Mantén esta separación: el repositorio define la política de persistencia, y el servicio la lógica de negocio.

### Modelos

- `CategoryModel`: categorías simples con `name`, `description` y `active`.
- `ProductModel`: productos con referencia a `Category`, precio, imágenes y variantes:

```typescript
variants: { size: number; color: string; stock: number }[]
```

El inventario se controla por **variante** (talla + color), no por cantidad total genérica.

---

## 7. Instrucciones de testing

- **Actualmente no hay tests** en el proyecto. El script `npm test` solo imprime un error por defecto.
- Si se agrega testing, se recomienda usar un framework como Jest o Vitest con `supertest` para probar los endpoints de Express.
- Para tests de integración se necesitaría una instancia de MongoDB (por ejemplo, MongoDB Memory Server) para no depender de la base de datos real.

---

## 8. Consideraciones de seguridad

- No expongas `.env` ni credenciales en el repositorio (ya están ignoradas en `.gitignore`).
- Autenticación JWT implementada con roles `admin` y `customer`. Los endpoints de catálogo son públicos; los endpoints de gestión requieren `admin`; los endpoints de compras requieren `customer` autenticado.
- No exponer el campo `password` en respuestas de usuarios.
- No hay validación de entrada con bibliotecas como Zod o Joi; los errores de validación de Mongoose son el único control actual. Considera agregar validación explícita en los servicios o middleware antes de la producción.
- No hay manejo centralizado de errores: cada controller tiene su propio `try/catch`. Considera un middleware de errores de Express para evitar respuestas inconsistentes y fugas de información.

---

## 9. Ramas de trabajo

El repositorio tiene al menos dos ramas locales:

- `main`
- `develop` (rama activa en el contexto de trabajo)

Revisa si tu tarea debe integrarse en `develop` o en `main` antes de crear una rama de feature.

---

## 10. Notas útiles para agentes

- **Consulta el grafo antes de actuar:** lee `.agents/project-graph.json` y `.agents/project-graph.md` para entender el estado actual, dependencias, convenciones e inconsistencias antes de crear, modificar o eliminar archivos.
- **Actualiza el grafo después de actuar:** cualquier cambio que afecte arquitectura, dependencias, rutas, modelos, servicios, repositorios, controllers o convenciones debe reflejarse inmediatamente en `.agents/project-graph.json` y `.agents/project-graph.md`.
- Si agregas un nuevo dominio, sigue la estructura de capas existente: `model → repository → service → controller → routes`.
- Monta las rutas nuevas en `src/app.ts` bajo el prefijo `/api/v1/`.
- Aplica el middleware de autenticación y autorización según el rol requerido: catálogo público, compras requieren `customer`, gestión requiere `admin`.
- El registro público (`POST /auth/register`) crea usuarios con rol `customer`.
- El seed del primer administrador está en `src/seedAdmin.ts` y usa variables `ADMIN_*` del `.env` o valores por defecto.
- Verifica que `npm run build` compile sin errores antes de finalizar cualquier cambio significativo.
- Si modificas el punto de entrada o la estructura de salida de `tsc`, actualiza también el script `start` en `package.json`.

---

## 11. Estado actual y próximos pasos sugeridos

Implementado:

- Autenticación con JWT y roles (`admin`, `customer`).
- Registro público de clientes (`POST /auth/register`).
- Seed del primer administrador en `src/seedAdmin.ts`.
- CRUD de usuarios con datos de contacto (documento y teléfono) y eliminación lógica.
- CRUD de productos con variantes por talla/color y precio de compra.
- CRUD de categorías con eliminación lógica.
- Catálogo público de productos y categorías.
- Registro de compras/ventas con descuento automático de stock y snapshot de precios.
- Movimientos de inventario (entradas, salidas, ajustes) con trazabilidad completa, gestionados por admin.
- Índices estratégicos en modelos para optimizar consultas.
- Conexión a MongoDB y servidor Express funcional.
- Documentación del proyecto en `README.md`, `docs/API.md`, `docs/MODELS.md` y `docs/TESTING_MANUAL.md`.
- Grafo de trazabilidad en `.agents/project-graph.json` y `.agents/project-graph.md`.

Pendiente según el MVP:

1. Módulo de reportes (ventas del día/mes, productos más vendidos, ganancias, inventario bajo).
2. Validación de entrada con Zod o Joi.
3. Middleware centralizado de errores.
4. Tests automatizados.
5. Frontend con React.
6. Docker.
