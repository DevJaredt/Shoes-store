# Shoes Store — API Reference

Base URL: `/api/v1`

## Endpoints públicos

- `POST /auth/register` — Registro de cliente
- `POST /auth/login` — Inicio de sesión
- `GET /products` — Listar productos
- `GET /products/:id` — Ver producto (próximamente)
- `GET /categories` — Listar categorías
- `GET /categories/:id` — Ver categoría (próximamente)

Todos los demás endpoints requieren autenticación con:

```http
Authorization: Bearer <token_jwt>
```

---

## Autenticación

### POST /auth/register

Registro público para clientes. El rol será `customer` automáticamente.

**Body:**

```json
{
  "name": "Carlos López",
  "email": "carlos@correo.com",
  "password": "cliente123",
  "document": "123456789",
  "phone": "3001234567"
}
```

**Response 201:**

```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Carlos López",
    "email": "carlos@correo.com",
    "document": "123456789",
    "phone": "3001234567",
    "role": "customer"
  }
}
```

### POST /auth/login

Inicia sesión y devuelve un token JWT.

**Body:**

```json
{
  "email": "admin@tienda.com",
  "password": "admin123"
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "...",
      "name": "Administrador",
      "email": "admin@tienda.com",
      "role": "admin"
    }
  }
}
```

---

## Usuarios (admin)

### POST /users

Crea un usuario. Requiere admin.

**Body:**

```json
{
  "name": "Otro Admin",
  "email": "otro@tienda.com",
  "password": "admin123",
  "document": "ADMIN-002",
  "phone": "3000000002",
  "role": "admin"
}
```

### GET /users

Lista todos los usuarios activos. Requiere admin.

### GET /users/me

Obtiene el perfil del usuario autenticado. Disponible para cualquier usuario autenticado.

### GET /users/:id

Obtiene un usuario por ID. Requiere autenticación.

### PUT /users/:id

Actualiza un usuario. Un `customer` solo puede editar su propio perfil. Un `admin` puede editar cualquier usuario.

### DELETE /users/:id

Desactiva un usuario (soft delete). Requiere admin.

---

## Categorías

### GET /categories

Lista categorías activas. Público.

### GET /categories/:id

Obtiene una categoría por ID. Público.

### POST /categories

Crea una categoría. Requiere admin.

**Body:**

```json
{
  "name": "Caballero",
  "description": "Zapatos para caballero"
}
```

### PUT /categories/:id

Actualiza una categoría. Requiere admin.

### DELETE /categories/:id

Elimina una categoría lógicamente. Requiere admin.

---

## Productos

### GET /products

Lista todos los productos. Público.

**Response 200:**

```json
{
  "success": true,
  "count": 1,
  "data": [...]
}
```

### POST /products

Crea un producto. Requiere admin.

**Body:**

```json
{
  "name": "Nike Air Max",
  "brand": "Nike",
  "category": "...categoryId...",
  "description": "Zapatos deportivos",
  "purchasePrice": 120000,
  "price": 250000,
  "images": ["url1", "url2"],
  "variants": [
    { "size": 38, "color": "Negro", "stock": 5 },
    { "size": 39, "color": "Negro", "stock": 8 }
  ]
}
```

### PUT /products/:id

Actualiza un producto. Requiere admin.

### DELETE /products/:id

Elimina un producto físicamente. Requiere admin.

---

## Ventas (compras)

### POST /sales

Registra una compra. El `customer` se obtiene del token JWT automáticamente.

**Body:**

```json
{
  "items": [
    {
      "product": "...productId...",
      "size": 39,
      "color": "Negro",
      "quantity": 1,
      "unitPrice": 250000
    }
  ],
  "discount": 0,
  "paymentMethod": "cash"
}
```

### GET /sales

- **Admin:** lista todas las ventas.
- **Customer:** lista solo sus propias compras.

### GET /sales/:id

- **Admin:** ve cualquier venta.
- **Customer:** solo ve ventas propias.

---

## Movimientos de inventario (admin)

### POST /inventory-movements

Registra un movimiento de inventario (entrada, salida o ajuste). Requiere admin.

**Body:**

```json
{
  "product": "...productId...",
  "type": "entry",
  "size": 39,
  "color": "Negro",
  "quantity": 10,
  "reason": "Compra a proveedor"
}
```

### GET /inventory-movements

Lista todos los movimientos. Requiere admin.

### GET /inventory-movements/product/:productId

Historial de movimientos de un producto. Requiere admin.

---

## Notas de diseño

- Los endpoints de lectura de productos y categorías son públicos para que los clientes vean el catálogo sin registrarse.
- Registro y login son públicos.
- Las compras generan automáticamente movimientos de salida de inventario.
