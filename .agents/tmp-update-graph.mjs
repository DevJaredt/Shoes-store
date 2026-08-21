import fs from 'fs';
import path from 'path';

const jsonPath = '.agents/project-graph.json';
const mdPath = '.agents/project-graph.md';

// Update JSON
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

data.stack.frontend.styling = 'Tailwind CSS v4 with @tailwindcss/vite plugin';

for (const node of data.nodes) {
  if (node.id === 'frontend/package.json') {
    node.description = 'Frontend manifest. Scripts dev, build, lint, preview. Dependencias: React 19, React Router DOM 7, Axios. DevDeps: Vite 8, Tailwind CSS v4, @tailwindcss/vite, oxlint.';
  } else if (node.id === 'frontend/vite.config.ts') {
    node.description = 'Configuración de Vite con plugin React, plugin Tailwind CSS (@tailwindcss/vite), path aliases y proxy /api -> backend.';
  }
}

const existingIds = new Set(data.nodes.map(n => n.id));
const newNodes = [
  {
    id: 'frontend/src/index.css',
    type: 'style_config',
    path: 'frontend/src/index.css',
    description: 'Importa Tailwind CSS (@import "tailwindcss") y define capas base/utilities para el frontend.'
  },
  {
    id: 'frontend/src/features/landing/pages/LandingPage.tsx',
    type: 'page',
    path: 'frontend/src/features/landing/pages/LandingPage.tsx',
    description: 'Landing page pública. Muestra hero, categorías y productos destacados. Consume useCatalog.'
  },
  {
    id: 'frontend/src/features/landing/index.ts',
    type: 'feature_barrel',
    path: 'frontend/src/features/landing/index.ts',
    description: 'Barrel export del feature landing.'
  },
  {
    id: 'frontend/src/features/catalog/hooks/useCatalog.ts',
    type: 'hook',
    path: 'frontend/src/features/catalog/hooks/useCatalog.ts',
    description: 'Hook que obtiene productos y categorías públicas vía productsApi y categoriesApi.'
  },
  {
    id: 'frontend/src/features/admin/components/AdminLayout.tsx',
    type: 'component',
    path: 'frontend/src/features/admin/components/AdminLayout.tsx',
    description: 'Layout del panel admin con sidebar/header y botón de logout visible. Usa useAuth y protege /admin.'
  }
];
for (const n of newNodes) {
  if (!existingIds.has(n.id)) data.nodes.push(n);
}

const edgeKey = (e) => `${e.from}::${e.to}::${e.relationship}`;
const existingEdges = new Set(data.edges.map(edgeKey));
const newEdges = [
  { from: 'frontend/src/App.tsx', to: 'frontend/src/features/landing/pages/LandingPage.tsx', relationship: 'routes_to' },
  { from: 'frontend/src/App.tsx', to: 'frontend/src/features/admin/components/AdminLayout.tsx', relationship: 'routes_to' },
  { from: 'frontend/src/features/landing/pages/LandingPage.tsx', to: 'frontend/src/features/catalog/hooks/useCatalog.ts', relationship: 'uses_hook' },
  { from: 'frontend/src/features/admin/components/AdminLayout.tsx', to: 'frontend/src/features/auth/context/AuthContext.tsx', relationship: 'uses_context' }
];
for (const e of newEdges) {
  if (!existingEdges.has(edgeKey(e))) data.edges.push(e);
}

data.conventions.push('Framework de estilos del frontend: Tailwind CSS v4 con plugin @tailwindcss/vite e import en frontend/src/index.css.');
data.conventions.push('Componentes base reutilizables del frontend en frontend/src/components/ (Button, Input, Card, Select, Loading, ErrorMessage).');
data.conventions.push('Helper getProductImage en frontend/src/utils/helpers.ts usa data URI SVG como fallback.');

data.resolved_issues.push({
  id: 'ISSUE-015',
  description: 'Rediseño visual del frontend con Tailwind CSS v4: landing page separada del catálogo (ruta /), componentes base, páginas de auth/admin rediseñadas y logout visible en AdminLayout.',
  location: 'frontend/src/index.css, frontend/vite.config.ts, frontend/src/App.tsx, frontend/src/features/landing/, frontend/src/features/admin/components/AdminLayout.tsx'
});

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');

// Update Markdown
let md = fs.readFileSync(mdPath, 'utf-8');

const replacements = [
  [
    '| **Frontend** | React 19, TypeScript, Vite 8, React Router DOM 7, Axios |',
    '| **Frontend** | React 19, TypeScript, Vite 8, React Router DOM 7, Axios, Tailwind CSS v4 |'
  ],
  [
    `        subgraph Infraestructura_FE
            PkgFE[frontend/package.json]
            TsFE[frontend/tsconfig.app.json]
            ViteFE[frontend/vite.config.ts]
        end

        subgraph API_Client
            ApiClient[frontend/src/api/client.ts]
        end

        subgraph Shared_UI
            Layout[frontend/src/components/Layout.tsx]
            Navbar[frontend/src/components/Navbar.tsx]
            PrivateRoute[frontend/src/components/PrivateRoute.tsx]
            AdminRoute[frontend/src/components/AdminRoute.tsx]
        end

        subgraph Auth_FE
            AuthCtx[frontend/src/features/auth/context/AuthContext.tsx]
            LoginPage[frontend/src/features/auth/pages/LoginPage.tsx]
            RegisterPage[frontend/src/features/auth/pages/RegisterPage.tsx]
        end

        subgraph Catalog_FE
            Catalog[frontend/src/features/catalog/pages/CatalogPage.tsx]
            ProductDetail[frontend/src/features/catalog/pages/ProductDetailPage.tsx]
            ProductCard[frontend/src/features/catalog/components/ProductCard.tsx]
        end

        subgraph Cart_FE
            CartCtx[frontend/src/features/cart/context/CartContext.tsx]
            CartPage[frontend/src/features/cart/pages/CartPage.tsx]
        end

        subgraph Sales_FE
            Checkout[frontend/src/features/sales/pages/CheckoutPage.tsx]
            Orders[frontend/src/features/sales/pages/OrdersPage.tsx]
        end

        subgraph Admin_FE
            AdminDash[frontend/src/features/admin/pages/AdminDashboardPage.tsx]
            AdminProducts[frontend/src/features/admin/pages/AdminProductsPage.tsx]
            AdminCategories[frontend/src/features/admin/pages/AdminCategoriesPage.tsx]
            AdminUsers[frontend/src/features/admin/pages/AdminUsersPage.tsx]
            AdminSales[frontend/src/features/admin/pages/AdminSalesPage.tsx]
            AdminInventory[frontend/src/features/admin/pages/AdminInventoryPage.tsx]
        end`,
    `        subgraph Infraestructura_FE
            PkgFE[frontend/package.json]
            TsFE[frontend/tsconfig.app.json]
            ViteFE[frontend/vite.config.ts]
            TailwindCfg[frontend/src/index.css]
        end

        subgraph API_Client
            ApiClient[frontend/src/api/client.ts]
        end

        subgraph Shared_UI
            Layout[frontend/src/components/Layout.tsx]
            Navbar[frontend/src/components/Navbar.tsx]
            PrivateRoute[frontend/src/components/PrivateRoute.tsx]
            AdminRoute[frontend/src/components/AdminRoute.tsx]
        end

        subgraph Auth_FE
            AuthCtx[frontend/src/features/auth/context/AuthContext.tsx]
            LoginPage[frontend/src/features/auth/pages/LoginPage.tsx]
            RegisterPage[frontend/src/features/auth/pages/RegisterPage.tsx]
        end

        subgraph Landing_FE
            LandingIndex[frontend/src/features/landing/index.ts]
            LandingPage[frontend/src/features/landing/pages/LandingPage.tsx]
        end

        subgraph Catalog_FE
            UseCatalog[frontend/src/features/catalog/hooks/useCatalog.ts]
            Catalog[frontend/src/features/catalog/pages/CatalogPage.tsx]
            ProductDetail[frontend/src/features/catalog/pages/ProductDetailPage.tsx]
            ProductCard[frontend/src/features/catalog/components/ProductCard.tsx]
        end

        subgraph Cart_FE
            CartCtx[frontend/src/features/cart/context/CartContext.tsx]
            CartPage[frontend/src/features/cart/pages/CartPage.tsx]
        end

        subgraph Sales_FE
            Checkout[frontend/src/features/sales/pages/CheckoutPage.tsx]
            Orders[frontend/src/features/sales/pages/OrdersPage.tsx]
        end

        subgraph Admin_FE
            AdminLayout[frontend/src/features/admin/components/AdminLayout.tsx]
            AdminDash[frontend/src/features/admin/pages/AdminDashboardPage.tsx]
            AdminProducts[frontend/src/features/admin/pages/AdminProductsPage.tsx]
            AdminCategories[frontend/src/features/admin/pages/AdminCategoriesPage.tsx]
            AdminUsers[frontend/src/features/admin/pages/AdminUsersPage.tsx]
            AdminSales[frontend/src/features/admin/pages/AdminSalesPage.tsx]
            AdminInventory[frontend/src/features/admin/pages/AdminInventoryPage.tsx]
        end`
  ],
  [
    `    Router -->|render| Layout
    Router -->|render| Navbar
    Router -->|render| PrivateRoute
    Router -->|render| AdminRoute
    Router -->|render| LoginPage
    Router -->|render| RegisterPage
    Router -->|render| Catalog
    Router -->|render| ProductDetail
    Router -->|render| CartPage
    Router -->|render| Checkout
    Router -->|render| Orders
    Router -->|render| AdminDash
    Router -->|render| AdminProducts
    Router -->|render| AdminCategories
    Router -->|render| AdminUsers
    Router -->|render| AdminSales
    Router -->|render| AdminInventory

    AuthCtx -->|provee| LoginPage
    AuthCtx -->|provee| RegisterPage
    AuthCtx -->|provee| PrivateRoute
    AuthCtx -->|provee| AdminRoute
    CartCtx -->|provee| Catalog
    CartCtx -->|provee| CartPage
    CartCtx -->|provee| Checkout`,
    `    Router -->|render| Layout
    Router -->|render| Navbar
    Router -->|render| PrivateRoute
    Router -->|render| AdminRoute
    Router -->|render /| LandingPage
    Router -->|render| LoginPage
    Router -->|render| RegisterPage
    Router -->|render /catalog| Catalog
    Router -->|render| ProductDetail
    Router -->|render| CartPage
    Router -->|render| Checkout
    Router -->|render| Orders
    Router -->|render /admin| AdminLayout
    Router -->|render| AdminDash
    Router -->|render| AdminProducts
    Router -->|render| AdminCategories
    Router -->|render| AdminUsers
    Router -->|render| AdminSales
    Router -->|render| AdminInventory

    AuthCtx -->|provee| LoginPage
    AuthCtx -->|provee| RegisterPage
    AuthCtx -->|provee| PrivateRoute
    AuthCtx -->|provee| AdminRoute
    AuthCtx -->|provee| AdminLayout
    CartCtx -->|provee| Catalog
    CartCtx -->|provee| CartPage
    CartCtx -->|provee| Checkout

    LandingPage -->|consume| UseCatalog
    AdminLayout -->|usa useAuth / logout| AuthCtx`
  ],
  [
    `│   │   │   ├── auth/
│   │   │   ├── catalog/
│   │   │   ├── cart/
│   │   │   ├── sales/
│   │   │   └── admin/`,
    `│   │   │   ├── auth/
│   │   │   ├── catalog/
│   │   │   ├── cart/
│   │   │   ├── landing/
│   │   │   ├── sales/
│   │   │   └── admin/`
  ],
  [
    `### Frontend

1. **Idioma del código:** inglés para archivos, variables, clases y funciones.
2. **Idioma de UI:** español.
3. **Estructura por funcionalidades (feature-based):** cada feature agrupa componentes, páginas, hooks y servicios.
4. **Path alias \`@/\`** apunta a \`frontend/src/\`.
5. **Cliente API centralizado** en \`frontend/src/api/client.ts\` con interceptor de autenticación.
6. **Estado global mínimo:** Context API para auth y cart.
7. **No duplicar lógica de negocio** del backend; el frontend solo presenta y consume la API.`,
    `### Frontend

1. **Idioma del código:** inglés para archivos, variables, clases y funciones.
2. **Idioma de UI:** español.
3. **Estructura por funcionalidades (feature-based):** cada feature agrupa componentes, páginas, hooks y servicios (\`auth\`, \`catalog\`, \`cart\`, \`landing\`, \`sales\`, \`admin\`).
4. **Path alias \`@/\`** apunta a \`frontend/src/\`.
5. **Cliente API centralizado** en \`frontend/src/api/client.ts\` con interceptor de autenticación.
6. **Estado global mínimo:** Context API para auth y cart.
7. **No duplicar lógica de negocio** del backend; el frontend solo presenta y consume la API.
8. **Framework de estilos:** Tailwind CSS v4, configurado en \`frontend/vite.config.ts\` (plugin \`@tailwindcss/vite\`) e importado en \`frontend/src/index.css\` (\`@import "tailwindcss";\`). Componentes base reutilizables (\`Button\`, \`Input\`, \`Card\`, \`Select\`, \`Loading\`, \`ErrorMessage\`) en \`frontend/src/components/\`.
9. **Helpers de presentación:** \`frontend/src/utils/helpers.ts\` incluye \`getProductImage\` con fallback a data URI SVG.`
  ],
  [
    '| ISSUE-014 | Monorepo creado con backend/ y frontend/. CORS agregado al backend para permitir la integración. | `package.json, backend/src/app.ts, backend/package.json` |',
    '| ISSUE-014 | Monorepo creado con backend/ y frontend/. CORS agregado al backend para permitir la integración. | `package.json, backend/src/app.ts, backend/package.json` |\n| ISSUE-015 | Rediseño visual del frontend con Tailwind CSS v4: landing page separada del catálogo (`/`), componentes base, páginas de auth/admin rediseñadas y logout visible en AdminLayout. | `frontend/src/index.css`, `frontend/vite.config.ts`, `frontend/src/App.tsx`, `frontend/src/features/landing/`, `frontend/src/features/admin/components/AdminLayout.tsx` |'
  ]
];

for (const [old, replacement] of replacements) {
  if (!md.includes(old)) {
    throw new Error(`Pattern not found in markdown: ${old.slice(0, 80)}`);
  }
  md = md.replace(old, replacement);
}

fs.writeFileSync(mdPath, md, 'utf-8');
console.log('OK');
