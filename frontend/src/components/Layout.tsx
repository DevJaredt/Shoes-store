import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-surface py-8 text-center text-sm font-semibold text-text-secondary">
        <p>© {new Date().getFullYear()} Shoes Store. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
