# Guía de pruebas manuales — Shoes Store API

Base URL: `http://localhost:3000/api/v1`

---

## 1. Preparación

1. Asegúrate de tener MongoDB corriendo y el archivo `.env` configurado con `PORT`, `MONGODB_URI` y `JWT_SECRET`.
2. Instala dependencias si no lo has hecho:

```bash
npm install
```

3. Inicia el servidor:

```bash
npm run dev
```

4. Crea el primer usuario administrador:

```bash
npx tsx src/seedAdmin.ts
```

Credenciales por defecto:
- Email: `admin@tienda.com`
- Contraseña: `admin123`

---

## 2. Registro de cliente (público)

### POST /auth/register

Cualquiera puede registrarse como cliente para comprar.

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Carlos López",
    "email": "carlos@correo.com",
    "password": "cliente123",
    "document": "123456789",
    "phone": "3001234567"
  }'
```

---

## 3. Login y token

### POST /auth/login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tienda.com",
    "password": "admin123"
  }'
```

Copia el valor de `data.token` y guárdalo en una variable:

```bash
TOKEN=eyJhbGciOiJIUzI1NiIs...
```

> En Windows con PowerShell usá: `$TOKEN="eyJhbGciOiJIUzI1NiIs..."`
> En Windows con CMD usá: `set TOKEN=eyJhbGciOiJIUzI1NiIs...`

---

## 4. Endpoints públicos (sin token)

### Listar productos

```bash
curl -X GET http://localhost:3000/api/v1/products
```

### Listar categorías

```bash
curl -X GET http://localhost:3000/api/v1/categories
```

---

## 5. Admin: gestión de usuarios

### Crear usuario (admin)

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Otro Admin",
    "email": "otro@tienda.com",
    "password": "admin123",
    "document": "ADMIN-002",
    "phone": "3000000002",
    "role": "admin"
  }'
```

### Listar usuarios

```bash
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer $TOKEN"
```

### Ver mi perfil

```bash
curl -X GET http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 6. Admin: categorías

### Crear categoría

```bash
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Caballero",
    "description": "Zapatos para caballero"
  }'
```

### Listar categorías

```bash
curl -X GET http://localhost:3000/api/v1/categories
```

---

## 7. Admin: productos

### Crear producto

Reemplaza `:categoryId` por el ID de una categoría existente.

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Nike Air Max",
    "brand": "Nike",
    "category": ":categoryId",
    "description": "Zapatos deportivos",
    "purchasePrice": 120000,
    "price": 250000,
    "images": ["https://example.com/nike.jpg"],
    "variants": [
      { "size": 38, "color": "Negro", "stock": 5 },
      { "size": 39, "color": "Negro", "stock": 8 },
      { "size": 40, "color": "Blanco", "stock": 3 }
    ]
  }'
```

### Listar productos

```bash
curl -X GET http://localhost:3000/api/v1/products
```

### Actualizar producto

```bash
curl -X PUT http://localhost:3000/api/v1/products/:id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "price": 230000
  }'
```

### Eliminar producto

```bash
curl -X DELETE http://localhost:3000/api/v1/products/:id \
  -H "Authorization: Bearer $TOKEN"
```

---

## 8. Cliente: compras

Primero registrate o logueate con un cliente para obtener su token.

### Crear compra

```bash
curl -X POST http://localhost:3000/api/v1/sales \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_DEL_CLIENTE" \
  -d '{
    "items": [
      {
        "product": ":productId",
        "size": 39,
        "color": "Negro",
        "quantity": 1,
        "unitPrice": 250000
      }
    ],
    "discount": 0,
    "paymentMethod": "cash"
  }'
```

### Ver mis compras

```bash
curl -X GET http://localhost:3000/api/v1/sales \
  -H "Authorization: Bearer TOKEN_DEL_CLIENTE"
```

### Ver compra por ID

```bash
curl -X GET http://localhost:3000/api/v1/sales/:id \
  -H "Authorization: Bearer TOKEN_DEL_CLIENTE"
```

### Admin ver todas las compras

```bash
curl -X GET http://localhost:3000/api/v1/sales \
  -H "Authorization: Bearer TOKEN_DE_ADMIN"
```

---

## 9. Admin: movimientos de inventario

### Registrar entrada

```bash
curl -X POST http://localhost:3000/api/v1/inventory-movements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "product": ":productId",
    "type": "entry",
    "size": 39,
    "color": "Negro",
    "quantity": 10,
    "reason": "Compra a proveedor"
  }'
```

### Listar movimientos

```bash
curl -X GET http://localhost:3000/api/v1/inventory-movements \
  -H "Authorization: Bearer $TOKEN"
```

---

## Notas importantes

- Los endpoints de **login** y **register** son públicos.
- Los **productos** y **categorías** son visibles sin autenticación para que los clientes puedan ver el catálogo.
- Para **crear, editar o eliminar productos, categorías y usuarios** se requiere rol `admin`.
- Para **comprar** se requiere estar logueado como `customer`.
- Para **gestionar inventario** se requiere rol `admin`.
- Si el token expira (1 día), volvé a ejecutar el login.
