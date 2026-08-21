import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useCart } from '@/features/cart/context/CartContext';
import {
  ShoppingBag,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Package,
} from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/catalog', label: 'Catálogo' },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const adminLink = user?.role === 'admin' ? { to: '/admin', label: 'Admin' } : null;
  const ordersLink = user?.role === 'customer' ? { to: '/orders', label: 'Mis pedidos' } : null;

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
    }, 300);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-2xl font-black uppercase tracking-tight text-text transition hover:opacity-70"
        >
          Shoes<span className="text-text-secondary">.</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`text-xs font-bold uppercase tracking-wide transition hover:text-text-secondary ${
                  isActive(link.to) ? 'text-text' : 'text-text-secondary'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {adminLink && (
            <li>
              <Link
                to={adminLink.to}
                className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide transition hover:text-text-secondary ${
                  isActive(adminLink.to) ? 'text-text' : 'text-text-secondary'
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                {adminLink.label}
              </Link>
            </li>
          )}
          {ordersLink && (
            <li>
              <Link
                to={ordersLink.to}
                className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide transition hover:text-text-secondary ${
                  isActive(ordersLink.to) ? 'text-text' : 'text-text-secondary'
                }`}
              >
                <Package className="h-3.5 w-3.5" />
                {ordersLink.label}
              </Link>
            </li>
          )}
        </ul>

        <div className="hidden items-center gap-5 md:flex">
          <Link
            to="/cart"
            className="relative p-1 text-text transition hover:text-text-secondary"
            aria-label="Carrito"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center bg-primary px-1 text-[10px] font-bold text-white animate-scale-in">
                {totalItems}
              </span>
            )}
          </Link>

          <div
            className={`flex items-center gap-3 border-l border-border pl-5 transition-all duration-300 ${
              isLoggingOut ? 'pointer-events-none opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            {user ? (
              <>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
                  <User className="h-4 w-4" />
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-text-secondary transition hover:text-danger"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-bold uppercase tracking-wide text-text-secondary transition hover:text-text"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-text-secondary active:scale-[0.98]"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          className="p-1 text-text transition hover:text-text-secondary md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-border bg-surface transition-all duration-300 md:hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-4">
          <ul className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`block text-xs font-bold uppercase tracking-wide transition ${
                    isActive(link.to) ? 'text-text' : 'text-text-secondary hover:text-text'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {adminLink && (
              <li>
                <Link
                  to={adminLink.to}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide transition ${
                    isActive(adminLink.to) ? 'text-text' : 'text-text-secondary hover:text-text'
                  }`}
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  {adminLink.label}
                </Link>
              </li>
            )}
            {ordersLink && (
              <li>
                <Link
                  to={ordersLink.to}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide transition ${
                    isActive(ordersLink.to) ? 'text-text' : 'text-text-secondary hover:text-text'
                  }`}
                >
                  <Package className="h-3.5 w-3.5" />
                  {ordersLink.label}
                </Link>
              </li>
            )}
          </ul>

          <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
            <Link
              to="/cart"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-text-secondary transition hover:text-text"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Carrito
              </span>
              {totalItems > 0 && (
                <span className="bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
            {user ? (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 text-left text-xs font-bold uppercase tracking-wide text-danger transition hover:text-text"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center text-xs font-bold uppercase tracking-wide text-text-secondary transition hover:text-text"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="bg-primary py-2.5 text-center text-xs font-bold uppercase tracking-wide text-white transition hover:bg-text-secondary"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
