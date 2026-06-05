import { useState } from 'react';
import { Code2, Box, Link2, Eye } from 'lucide-react';
import UMLDiagram from '../components/UMLDiagram';

type Tab = 'intro' | 'clases' | 'relaciones' | 'diagrama';

const RELACIONES = [
  { tipo: 'Asociación', simbolo: '──────▶', color: 'text-blue-400', desc: 'Relación estructural entre dos clases. En SINIC: un Interesado está asociado a una o más Unidades Administrativas.' },
  { tipo: 'Herencia (Generalización)', simbolo: '──────▷', color: 'text-purple-400', desc: 'Una clase hijo hereda atributos y operaciones de la clase padre. En LADM_COL: LA_Party es padre de col_interesado.' },
  { tipo: 'Composición', simbolo: '◆──────', color: 'text-red-400', desc: 'Relación parte-todo donde las partes no pueden existir sin el todo. Ciclo de vida vinculado.' },
  { tipo: 'Agregación', simbolo: '◇──────', color: 'text-yellow-400', desc: 'Similar a composición pero las partes pueden existir independientemente. El todo puede cambiar de partes.' },
];

const VISIBILIDAD = [
  { sym: '+', nombre: 'Público',    desc: 'Accesible desde cualquier clase.', color: 'text-green-400' },
  { sym: '-', nombre: 'Privado',    desc: 'Solo accesible dentro de la propia clase.', color: 'text-red-400' },
  { sym: '#', nombre: 'Protegido', desc: 'Accesible desde la clase y sus subclases.', color: 'text-yellow-400' },
  { sym: '~', nombre: 'Paquete',   desc: 'Accesible desde clases del mismo paquete.', color: 'text-blue-400' },
];

const TIPOS_DIAGRAMA = [
  { tipo: 'Diagrama de Clases ★',  desc: 'Estructura estática: clases, atributos, relaciones.',        color: 'bg-navy-600' },
  { tipo: 'Diagrama de Secuencia', desc: 'Interacción entre objetos en el tiempo.',                     color: 'bg-gray-700' },
  { tipo: 'Diagrama de Casos de Uso', desc: 'Funcionalidades del sistema desde perspectiva del actor.', color: 'bg-gray-700' },
  { tipo: 'Diagrama de Actividades', desc: 'Flujo de control: pasos de un proceso.',                   color: 'bg-gray-700' },
  { tipo: 'Diagrama de Estado',    desc: 'Ciclo de vida de un objeto a través de estados.',             color: 'bg-gray-700' },
];

export default function AprendeUML() {
  const [tab, setTab] = useState<Tab>('intro');

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <Code2 size={12} /> Unified Modeling Language
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Aprende UML</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Lenguaje estándar de modelado visual. Entiende cómo se diseñan los modelos de datos del SINIC.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 mb-8 bg-gray-900 p-1.5 rounded-xl border border-gray-800 flex-wrap">
          {([
            { id: 'intro',      label: '¿Qué es UML?',      icon: Code2 },
            { id: 'clases',     label: 'Clases y Atributos', icon: Box },
            { id: 'relaciones', label: 'Relaciones',          icon: Link2 },
            { id: 'diagrama',   label: 'Diagrama SINIC',      icon: Eye },
          ] as { id: Tab; label: string; icon: typeof Code2 }[]).map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all duration-200
                ${tab === id ? 'bg-navy-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <Icon size={13} /><span>{label}</span>
            </button>
          ))}
        </div>

        {/* Tab: Intro */}
        {tab === 'intro' && (
          <div className="animate-fade-in space-y-6">
            <div className="card p-6 border-l-4 border-indigo-500">
              <h2 className="text-white font-bold text-xl mb-3">¿Qué es UML?</h2>
              <p className="text-gray-300 leading-relaxed text-sm">
                <strong className="text-white">UML (Unified Modeling Language)</strong> es un lenguaje estándar de modelado visual adoptado por la <em>Object Management Group (OMG)</em> en 1997. Permite especificar, visualizar, construir y documentar los artefactos de un sistema de software de forma independiente al lenguaje de programación. En el contexto del SINIC, UML se usa para diseñar el modelo de clases del LADM_COL.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Tipos de Diagramas UML</h3>
              <div className="grid grid-cols-1 gap-2">
                {TIPOS_DIAGRAMA.map(({ tipo, desc, color }) => (
                  <div key={tipo} className="flex items-center gap-4 p-4 card hover:-translate-y-0.5 transition-transform">
                    <div className={`w-3 h-3 rounded-full shrink-0 ${color}`} />
                    <div>
                      <div className="text-white font-medium text-sm">{tipo}</div>
                      <div className="text-gray-400 text-xs">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-2">★ Tipo enfocado en este módulo.</p>
            </div>
          </div>
        )}

        {/* Tab: Clases */}
        {tab === 'clases' && (
          <div className="animate-fade-in space-y-6">
            <div className="card p-6">
              <h2 className="text-white font-bold text-lg mb-4">Estructura de una Clase UML</h2>
              {/* Visual representation */}
              <div className="flex justify-center mb-6">
                <div className="font-mono text-sm border border-indigo-500 rounded-lg overflow-hidden w-64 shadow-xl shadow-indigo-900/20">
                  <div className="bg-indigo-600 px-4 py-2 text-center text-white font-bold">NombreClase</div>
                  <div className="bg-gray-800 border-t border-indigo-500/30 px-4 py-2 space-y-1">
                    <div className="text-green-400 text-xs">+ atributoPublico: Tipo</div>
                    <div className="text-red-400 text-xs">- atributoPrivado: Tipo</div>
                    <div className="text-yellow-400 text-xs"># atributoProtegido: Tipo</div>
                  </div>
                  <div className="bg-gray-800 border-t border-indigo-500/30 px-4 py-2 space-y-1">
                    <div className="text-blue-400 text-xs">+ operacion(): Retorno</div>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm text-center leading-relaxed">
                Una clase se divide en <strong className="text-white">3 secciones</strong>: nombre de la clase, atributos (variables) y operaciones (métodos).
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Modificadores de Visibilidad</h3>
              <div className="grid grid-cols-2 gap-3">
                {VISIBILIDAD.map(({ sym, nombre, desc, color }) => (
                  <div key={sym} className="card p-4 flex items-start gap-3">
                    <span className={`text-2xl font-bold font-mono ${color} shrink-0`}>{sym}</span>
                    <div>
                      <div className="text-white font-medium text-sm">{nombre}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="text-white font-semibold mb-3">Ejemplo: col_interesado en LADM_COL</h3>
              <div className="font-mono text-xs border border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-navy-600 px-4 py-2 text-center text-white font-bold">col_interesado</div>
                <div className="bg-gray-800 border-t border-gray-700 px-4 py-3 space-y-1.5">
                  <div className="text-green-400">+ t_id: Integer <span className="text-gray-500">[PK]</span></div>
                  <div className="text-green-400">+ t_ili_tid: UUID</div>
                  <div className="text-green-400">+ nombre: CharacterString</div>
                  <div className="text-green-400">+ tipo_documento: TipoDocumentoInteresadoTipo</div>
                  <div className="text-green-400">+ numero_documento: CharacterString</div>
                  <div className="text-green-400">+ tipo_interesado: InteresadoTipo</div>
                </div>
                <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 text-gray-500">
                  <span>// Sin métodos propios — clase de datos</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Relaciones */}
        {tab === 'relaciones' && (
          <div className="animate-fade-in space-y-4">
            <div className="card p-5 mb-2">
              <p className="text-gray-300 text-sm">
                Las relaciones en UML describen cómo interactúan las clases entre sí. En el modelo SINIC, las relaciones definen cómo los interesados, predios y geometrías están vinculados.
              </p>
            </div>
            {RELACIONES.map(({ tipo, simbolo, color, desc }) => (
              <div key={tipo} className="card p-5 hover:-translate-y-0.5 transition-transform">
                <div className="flex items-center gap-4 mb-2">
                  <code className={`font-mono text-sm font-bold ${color}`}>{simbolo}</code>
                  <h3 className="text-white font-semibold text-sm">{tipo}</h3>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
            <div className="card p-5 border border-emerald-500/20 bg-emerald-500/5">
              <h3 className="text-emerald-400 font-semibold mb-2 text-sm">Multiplicidad en LADM_COL SINIC</h3>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {[['1', 'Exactamente uno'],['0..1', 'Cero o uno'],['0..*', 'Cero o más (muchos)'],['1..*', 'Uno o más (al menos uno)']].map(([m, d]) => (
                  <div key={m} className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold w-12">{m}</span>
                    <span className="text-gray-400">{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Diagrama */}
        {tab === 'diagrama' && (
          <div className="animate-fade-in space-y-5">
            <div className="card p-4">
              <p className="text-gray-300 text-sm">
                Diagrama de clases del núcleo del modelo <strong className="text-white">LADM_COL SINIC V1.0</strong>. Muestra las tres clases principales y sus relaciones de asociación conforme a la Resolución 301 de 2025.
              </p>
            </div>
            <UMLDiagram />
            <div className="grid grid-cols-3 gap-3 text-xs text-center">
              {[
                { clase: 'LA_Party', tabla: 'col_interesado', color: 'bg-indigo-600', desc: 'Persona natural o jurídica con derechos sobre el predio' },
                { clase: 'LA_BAUnit', tabla: 'col_baunit', color: 'bg-cyan-700', desc: 'Unidad básica administrativa — identidad jurídica del predio' },
                { clase: 'LA_SpatialUnit', tabla: 'col_terreno', color: 'bg-emerald-700', desc: 'Representación geométrica del predio en el territorio' },
              ].map(({ clase, tabla, color, desc }) => (
                <div key={clase} className="card p-3">
                  <div className={`text-white font-bold text-xs px-2 py-1 rounded ${color} mb-2`}>{clase}</div>
                  <div className="font-mono text-gray-400 text-[10px] mb-1">{tabla}</div>
                  <div className="text-gray-500 text-[10px] leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
