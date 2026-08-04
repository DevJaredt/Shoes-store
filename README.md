# Shoes Store

Backend del sistema de gestión para una tienda de zapatos. Transforma el control manual de inventario, ventas y clientes en una aplicación organizada, trazable y lista para escalar.

## Alcance del MVP

- Autenticación con JWT y roles (`admin` y `customer`).
- Registro público de clientes.
- Gestión de usuarios con datos de contacto.
- Gestión de categorías con eliminación lógica.
- Gestión de productos con variantes por talla, color y stock.
- Catálogo público de productos y categorías.
- Registro de compras/ventas con descuento automático de stock.
- Movimientos de inventario (entradas, salidas, ajustes) con trazabilidad completa.
- Reportes básicos (ventas por período, productos más vendidos, ganancias, inventario bajo).

## Stack tecnológico

| Capa | Tecnología |
| --- | --- |
| Lenguaje | TypeScript 7.x |
| Runtime | Node.js |
| Framework web | Express 5.x |
| Base de datos | MongoDB |
| ODM | Mongoose 9.x |
| Autenticación | JWT + bcryptjs |
| Variables de entorno | `dotenv` |
| Ejecución en desarrollo | `tsx watch` |
| Compilación | `tsc` |

## Estructura del proyecto

```text
src/
├── app.ts                          # Configura Express y monta las rutas
├── server.ts                       # Inicia el servidor y conecta MongoDB
└── app/
    ├── controllers/                # Manejadores HTTP
    ├── database/                   # Conexión a MongoDB
    ├── middleware/                 # Middlewares (autenticación, autorización)
    ├── models/                     # Esquemas e interfaces de Mongoose
    ├── repositories/               # Acceso directo a la base de datos
    ├── routes/                     # Definición de rutas Express
    └── services/                   # Lógica de negocio
```

## Instalación

1. Clonar el repositorio.
2. Instalar dependencias:

```bash
npm install
```

3. Crear un archivo `.env` en la raíz con las variables documentadas en `.env.example`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/shoes-store
JWT_SECRET=tu_secreto_seguro_aqui
```

4. Crear el primer administrador:

```bash
npx tsx src/seedAdmin.ts
```

Credenciales por defecto:
- Email: `admin@tienda.com`
- Contraseña: `admin123`

5. Iniciar en desarrollo:

```bash
npm run dev
```

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Ejecuta el servidor en modo desarrollo con recarga en caliente. |
| `npm run build` | Compila TypeScript a la carpeta `dist/`. |
| `npm start` | Inicia la aplicación compilada desde `dist/server.js`. |

## Arquitectura

El proyecto sigue una arquitectura de capas clásicas:

```text
Routes -> Controllers -> Services -> Repositories -> Models
```

No se usa inyección de dependencias. Servicios y repositorios se exportan como instancias singleton.

## Autenticación y roles

- `admin`: puede gestionar productos, categorías, usuarios, ventas e inventario.
- `customer`: puede ver el catálogo, registrarse, iniciar sesión y realizar compras.

Los endpoints de catálogo (`GET /products`, `GET /categories`) son públicos. Los endpoints de compras requieren autenticación. Los endpoints de gestión requieren rol `admin`.

Los endpoints protegidos requieren un header:

```http
Authorization: Bearer <token_jwt>
```

## Documentación adicional

- [API Reference](docs/API.md)
- [Modelos de datos](docs/MODELS.md)
- [Guía de pruebas manuales](docs/TESTING_MANUAL.md)
- [Grafo de trazabilidad del proyecto](.agents/project-graph.md)

## Convenciones

- Código en inglés (archivos, variables, clases, funciones).
- Documentación de negocio y mensajes de error en español.
- Interfaces de Mongoose prefijadas con `I`.
- Modelos exportados como `ModelName`.
- Repositorios y servicios exportados como instancias singleton.

## Próximos pasos

- Agregar reportes con agregaciones de MongoDB.
- Implementar paginación en listados.
- Agregar validación de entrada con Zod o Joi.
- Agregar tests automatizados.
- Frontend con React.
