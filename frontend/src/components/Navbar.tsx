import { Link, useLocation } from 'react-router-dom';
import { Database, BookOpen, Code2, Map } from 'lucide-react';
import DBStatusIndicator from './DBStatusIndicator';

const navLinks = [
  { to: '/aprende-sinic', label: 'Aprende SINIC', icon: BookOpen },
  { to: '/aprende-uml',   label: 'Aprende UML',   icon: Code2 },
  { to: '/modelo-datos',  label: 'Modelo de Datos', icon: Map },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800 shadow-lg">
      <div className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-navy-600 flex items-center justify-center shadow-md">
            <Database size={18} className="text-emerald-400" />
          </div>
          <div className="hidden sm:block">
            <span className="text-white font-bold text-lg leading-none">SINIC</span>
            <span className="block text-gray-500 text-[10px] font-medium leading-none tracking-widest uppercase">
              LADM-COL V1.0
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${active
                    ? 'text-white bg-navy-600 shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
              >
                <Icon size={15} />
                <span className="hidden md:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status */}
        <div className="shrink-0">
          <DBStatusIndicator />
        </div>
      </div>
    </header>
  );
}
