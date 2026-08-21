import { Link } from 'react-router-dom';
import { useAdminProducts } from '../hooks/useAdminProducts';
import { useAdminCategories } from '../hooks/useAdminCategories';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { useAdminInventory } from '../hooks/useAdminInventory';
import { Loading, ErrorMessage } from '@/components';
import { ShoppingBag, Tags, Users, Package } from 'lucide-react';

const statConfig = [
  { label: 'Productos', to: '/admin/products', icon: ShoppingBag, color: 'text-accent', bg: 'bg-accent/10' },
  { label: 'Categorías', to: '/admin/categories', icon: Tags, color: 'text-success', bg: 'bg-success/10' },
  { label: 'Usuarios', to: '/admin/users', icon: Users, color: 'text-text', bg: 'bg-primary/5' },
  { label: 'Movimientos', to: '/admin/inventory', icon: Package, color: 'text-danger', bg: 'bg-danger/10' },
];

export function AdminDashboardPage() {
  const { products, isLoading: productsLoading, error: productsError } = useAdminProducts();
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useAdminCategories();
  const { users, isLoading: usersLoading, error: usersError } = useAdminUsers();
  const { movements, isLoading: movementsLoading, error: movementsError } = useAdminInventory();

  const isLoading = productsLoading || categoriesLoading || usersLoading || movementsLoading;
  const error = productsError || categoriesError || usersError || movementsError;

  if (isLoading) {
    return <Loading message="Cargando dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const stats = [
    { label: 'Productos', value: products.length },
    { label: 'Categorías', value: categories.length },
    { label: 'Usuarios', value: users.length },
    { label: 'Movimientos', value: movements.length },
  ];

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight text-text">Dashboard</h1>
      <p className="mt-2 text-text-secondary">Resumen general de la tienda</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const config = statConfig[index];
          const Icon = config.icon;
          return (
            <Link
              key={stat.label}
              to={config.to}
              className="group rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${config.bg} ${config.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="mt-4 text-3xl font-black text-text transition group-hover:text-accent">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-text-secondary">{stat.label}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
