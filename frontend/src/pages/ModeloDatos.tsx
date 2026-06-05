import { useState } from 'react';
import { Building2, MapPin, Users, Compass, Map, ChevronRight } from 'lucide-react';
import UnidadAdministrativa from '../components/cruds/UnidadAdministrativa';
import UnidadEspacial from '../components/cruds/UnidadEspacial';
import Interesados from '../components/cruds/Interesados';
import Topografia from '../components/cruds/Topografia';
import Cartografia from '../components/cruds/Cartografia';

type Section = 'baunit' | 'espacial' | 'interesados' | 'topografia' | 'cartografia';

const SECTIONS = [
  { id: 'baunit',      label: 'Unidad Administrativa', sub: 'col_baunit',              icon: Building2, color: 'text-blue-400' },
  { id: 'espacial',    label: 'Unidad Espacial',        sub: 'col_terreno / col_lindero', icon: MapPin,    color: 'text-emerald-400' },
  { id: 'interesados', label: 'Interesados',            sub: 'col_interesado',          icon: Users,     color: 'text-purple-400' },
  { id: 'topografia',  label: 'Topografía',             sub: 'col_punto',               icon: Compass,   color: 'text-orange-400' },
  { id: 'cartografia', label: 'Cartografía Catastral',  sub: 'cc_construccion',         icon: Map,       color: 'text-pink-400' },
] as const;

const COMPONENTS: Record<Section, React.ReactNode> = {
  baunit:      <UnidadAdministrativa />,
  espacial:    <UnidadEspacial />,
  interesados: <Interesados />,
  topografia:  <Topografia />,
  cartografia: <Cartografia />,
};

export default function ModeloDatos() {
  const [active, setActive] = useState<Section>('baunit');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen pt-16 flex">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 z-30 bg-gray-900 border-r border-gray-800
        transition-all duration-300 flex flex-col
        ${sidebarOpen ? 'w-64' : 'w-14'}`}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-3 py-3 border-b border-gray-800">
          {sidebarOpen && (
            <div>
              <div className="text-white font-semibold text-sm">Módulos SINIC</div>
              <div className="text-gray-500 text-xs">LADM_COL V1.0</div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all ml-auto"
            title={sidebarOpen ? 'Colapsar' : 'Expandir'}
          >
            <ChevronRight size={16} className={`transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {SECTIONS.map(({ id, label, sub, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setActive(id as Section)}
              className={active === id ? 'sidebar-item-active w-full text-left' : 'sidebar-item w-full text-left'}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon size={18} className={active === id ? 'text-white shrink-0' : `${color} shrink-0`} />
              {sidebarOpen && (
                <div className="min-w-0">
                  <div className="truncate text-xs font-semibold">{label}</div>
                  <div className="truncate text-[10px] font-mono text-gray-500">{sub}</div>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* SRID badge */}
        {sidebarOpen && (
          <div className="p-3 border-t border-gray-800">
            <div className="card-glass px-3 py-2 text-center">
              <div className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">SRID</div>
              <div className="text-emerald-400 font-mono text-xs font-bold">9377</div>
              <div className="text-gray-600 text-[10px]">Magna Sirgas Nacional</div>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-14'} p-6 min-h-screen bg-gray-950`}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <span>Modelo de Datos</span>
          <ChevronRight size={12} />
          <span className="text-white">{SECTIONS.find(s => s.id === active)?.label}</span>
          <span className="ml-auto font-mono bg-gray-800 px-2 py-0.5 rounded text-gray-400">
            {SECTIONS.find(s => s.id === active)?.sub}
          </span>
        </div>

        {/* CRUD Content */}
        <div className="animate-fade-in">
          {COMPONENTS[active]}
        </div>
      </main>
    </div>
  );
}
