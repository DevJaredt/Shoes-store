import fs from 'fs';

const jsonPath = '.agents/project-graph.json';
let json = fs.readFileSync(jsonPath, 'utf-8');

// Add styling to stack.frontend
json = json.replace(
  '    "state_management": "React Context API"\n    },',
  '    "state_management": "React Context API",\n    "styling": "Tailwind CSS v4 with @tailwindcss/vite plugin"\n    },'
);

// Update frontend/package.json description
json = json.replace(
  'Frontend manifest. Scripts dev, build, lint, preview. Dependencias: React 19, React Router DOM 7, Axios, Vite 8.',
  'Frontend manifest. Scripts dev, build, lint, preview. Dependencias: React 19, React Router DOM 7, Axios. DevDeps: Vite 8, Tailwind CSS v4, @tailwindcss/vite, oxlint.'
);

// Update frontend/vite.config.ts description
json = json.replace(
  'Configuración de Vite con plugin React, path aliases y proxy /api -> backend.',
  'Configuración de Vite con plugin React, plugin Tailwind CSS (@tailwindcss/vite), path aliases y proxy /api -> backend.'
);

// Insert new nodes before the closing bracket of the nodes array
const lastNode = `    {
      "id": "frontend/src/features/admin/pages/AdminInventoryPage.tsx",
      "type": "page",
      "path": "frontend/src/features/admin/pages/AdminInventoryPage.tsx",
      "description": "Gestión de movimientos de inventario para administradores."
    }
  ],`;

const newNodes = `    {
      "id": "frontend/src/features/admin/pages/AdminInventoryPage.tsx",
      "type": "page",
      "path": "frontend/src/features/admin/pages/AdminInventoryPage.tsx",
      "description": "Gestión de movimientos de inventario para administradores."
    },
    {
      "id": "frontend/src/index.css",
      "type": "style_config",
      "path": "frontend/src/index.css",
      "description": "Importa Tailwind CSS (@import \\"tailwindcss\\") y define capas base/utilities para el frontend."
    },
    {
      "id": "frontend/src/features/landing/pages/LandingPage.tsx",
      "type": "page",
      "path": "frontend/src/features/landing/pages/LandingPage.tsx",
      "description": "Landing page pública. Muestra hero, categorías y productos destacados. Consume useCatalog."
    },
    {
      "id": "frontend/src/features/landing/index.ts",
      "type": "feature_barrel",
      "path": "frontend/src/features/landing/index.ts",
      "description": "Barrel export del feature landing."
    },
    {
      "id": "frontend/src/features/catalog/hooks/useCatalog.ts",
      "type": "hook",
      "path": "frontend/src/features/catalog/hooks/useCatalog.ts",
      "description": "Hook que obtiene productos y categorías públicas vía productsApi y categoriesApi."
    },
    {
      "id": "frontend/src/features/admin/components/AdminLayout.tsx",
      "type": "component",
      "path": "frontend/src/features/admin/components/AdminLayout.tsx",
      "description": "Layout del panel admin con sidebar/header y botón de logout visible. Usa useAuth y protege /admin."
    }
  ],`;

if (!json.includes(lastNode)) {
  throw new Error('Last node not found');
}
json = json.replace(lastNode, newNodes);

// Insert new edges before closing bracket of edges array
const lastEdge = `    { "from": "frontend/src/features/admin/pages/AdminInventoryPage.tsx", "to": "frontend/src/api/client.ts", "relationship": "uses_http_client" }
  ],`;

const newEdges = `    { "from": "frontend/src/features/admin/pages/AdminInventoryPage.tsx", "to": "frontend/src/api/client.ts", "relationship": "uses_http_client" },
    { "from": "frontend/src/App.tsx", "to": "frontend/src/features/landing/pages/LandingPage.tsx", "relationship": "routes_to" },
    { "from": "frontend/src/App.tsx", "to": "frontend/src/features/admin/components/AdminLayout.tsx", "relationship": "routes_to" },
    { "from": "frontend/src/features/landing/pages/LandingPage.tsx", "to": "frontend/src/features/catalog/hooks/useCatalog.ts", "relationship": "uses_hook" },
    { "from": "frontend/src/features/admin/components/AdminLayout.tsx", "to": "frontend/src/features/auth/context/AuthContext.tsx", "relationship": "uses_context" }
  ],`;

if (!json.includes(lastEdge)) {
  throw new Error('Last edge not found');
}
json = json.replace(lastEdge, newEdges);

// Add conventions
const lastConvention = '    "CORS habilitado en el backend para permitir peticiones del frontend (FRONTEND_URL opcional)."';
if (!json.includes(lastConvention)) {
  throw new Error('Last convention not found');
}
json = json.replace(
  lastConvention,
  lastConvention + ',\n    "Framework de estilos del frontend: Tailwind CSS v4 con plugin @tailwindcss/vite e import en frontend/src/index.css.",\n    "Componentes base reutilizables del frontend en frontend/src/components/ (Button, Input, Card, Select, Loading, ErrorMessage).",\n    "Helper getProductImage en frontend/src/utils/helpers.ts usa data URI SVG como fallback."'
);

// Add resolved issue
const lastResolved = `    {
      "id": "ISSUE-014",
      "description": "Monorepo creado con backend/ y frontend/. CORS agregado al backend para permitir la integración.",
      "location": "package.json, backend/src/app.ts, backend/package.json"
    }
  ],`;
if (!json.includes(lastResolved)) {
  throw new Error('Last resolved issue not found');
}
const newResolved = `    {
      "id": "ISSUE-014",
      "description": "Monorepo creado con backend/ y frontend/. CORS agregado al backend para permitir la integración.",
      "location": "package.json, backend/src/app.ts, backend/package.json"
    },
    {
      "id": "ISSUE-015",
      "description": "Rediseño visual del frontend con Tailwind CSS v4: landing page separada del catálogo (ruta /), componentes base, páginas de auth/admin rediseñadas y logout visible en AdminLayout.",
      "location": "frontend/src/index.css, frontend/vite.config.ts, frontend/src/App.tsx, frontend/src/features/landing/, frontend/src/features/admin/components/AdminLayout.tsx"
    }
  ],`;
json = json.replace(lastResolved, newResolved);

fs.writeFileSync(jsonPath, json, 'utf-8');
console.log('JSON updated');
