import { useState } from 'react';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Loading } from '@/components';
import {
  LayoutDashboard,
  ShoppingBag,
  Tags,
  Users,
  Receipt,
  Package,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Productos', icon: ShoppingBag },
  { to: '/admin/categories', label: 'Categorías', icon: Tags },
  { to: '/admin/users', label: 'Usuarios', icon: Users },
  { to: '/admin/sales', label: 'Ventas', icon: Receipt },
  { to: '/admin/inventory', label: 'Inventario', icon: Package },
];

export function AdminLayout() {
  const { user, logout, isLoading } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (isLoading) {
    return <Loading />;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Admin header */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 px-4 py-4 shadow-sm backdrop-blur-md sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-xl font-black tracking-tighter text-text transition hover:opacity-80"
            >
              SHOES<span className="text-accent">.</span>
            </Link>
            <span className="hidden h-6 w-px bg-border sm:block" />
            <span className="hidden text-sm font-semibold text-text-secondary sm:block">
              Panel de administración
            </span>
          </div>

          <div
            className={`flex items-center gap-4 transition-all duration-300 ${
              isLoggingOut ? 'pointer-events-none opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            <div className="hidden items-center gap-2 rounded-full bg-muted px-3 py-1.5 sm:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-accent">
                <User className="h-4 w-4" />
              </div>
              <span className="max-w-[150px] truncate text-sm font-semibold text-text">
                {user.name}
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-secondary transition hover:border-danger hover:bg-danger/5 hover:text-danger"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
        {/* Sidebar */}
        <aside className="lg:w-64 lg:flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex w-full items-center justify-between rounded-2xl bg-surface px-4 py-3 text-sm font-semibold text-text shadow-sm ring-1 ring-border transition hover:bg-muted lg:hidden"
          >
            Menú de administración
            <ChevronDown
              className={`h-5 w-5 text-text-secondary transition-transform ${
                isMobileMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          <nav
            className={`mt-3 overflow-hidden rounded-2xl bg-surface p-2 shadow-sm ring-1 ring-border transition-all duration-300 lg:mt-0 lg:block ${
              isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100'
            }`}
          >
            <ul className="space-y-1">
              {adminLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                        active
                          ? 'bg-accent/10 text-accent'
                          : 'text-text-secondary hover:bg-muted hover:text-text'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${active ? 'text-accent' : 'text-text-secondary'}`} />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
