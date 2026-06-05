import { useState } from 'react';
import { BookOpen, Scale, Globe, FileCode, ChevronDown, ChevronUp } from 'lucide-react';

type Tab = 'resolucion' | 'iso' | 'interlis';

const DEFINICIONES = [
  { term: 'Gestor Catastral', def: 'Entidad pública o privada habilitada por el IGAC para ejecutar las actividades del catastro multipropósito en un territorio determinado, según los lineamientos técnicos de la Resolución 301 de 2025.' },
  { term: 'Predio', def: 'Unidad espacial básica del catastro, correspondiente a una porción de tierra con límites definidos, identificada mediante el número predial y registrada en el sistema catastral. Puede ser urbano, rural o de expansión urbana.' },
  { term: 'Unidad Administrativa (col_baunit)', def: 'Clase del modelo LADM_COL que representa la unidad jurídico-administrativa de un bien inmueble, equivalente al "Basic Administrative Unit". Vincula la descripción legal del predio con su geometría y los derechos reales constituidos.' },
  { term: 'Unidad Espacial (col_terreno)', def: 'Porción del territorio con geometría definida, representada en el modelo LADM_COL como col_terreno, col_lindero o col_punto. Sirve de soporte geográfico a la Unidad Administrativa catastral.' },
  { term: 'Interesado (col_interesado)', def: 'Persona natural o jurídica que tiene un derecho, restricción o responsabilidad (RRR) sobre un predio. El modelo la representa mediante la clase col_interesado, homóloga a LA_Party del estándar LADM internacional.' },
  { term: 'LADM_COL', def: 'Perfil colombiano del Land Administration Domain Model (ISO 19152). Define los submodelos oficiales para el catastro multipropósito en Colombia: Levantamiento Catastral, Registro, Antijurídico, SNR y SINIC.' },
  { term: 'Cartografía Catastral', def: 'Conjunto de representaciones gráficas y datos espaciales que describen las características físicas de los predios y las construcciones en ellos. Incluye cc_construccion y cc_unidadconstruccion en el submodelo SINIC.' },
  { term: 'Submodelo SINIC', def: 'Extensión del LADM_COL para el Sistema Nacional de Información Catastral, definida en la Resolución 301 de 2025. Establece las entidades, atributos, relaciones y restricciones para la gestión e intercambio de información catastral en Colombia.' },
];

const ISO_STANDARDS = [
  { code: 'ISO 19152-1:2024', title: 'LADM — Parte 1: Marco general', color: 'border-blue-500', icon: '🌐',
    desc: 'Establece el marco conceptual y terminológico del Land Administration Domain Model (LADM). Define los fundamentos ontológicos que permiten modelar derechos, restricciones y responsabilidades sobre la tierra de forma neutral a la jurisdicción.' },
  { code: 'ISO 19152-2:2025', title: 'LADM — Parte 2: RRR (Registro)', color: 'border-indigo-500', icon: '📋',
    desc: 'Detalla el modelo para el registro de Derechos (Rights), Restricciones (Restrictions) y Responsabilidades (Responsibilities) sobre inmuebles. Sirve como base para sistemas de registro de la propiedad inmueble.' },
  { code: 'ISO 19152-3:2024', title: 'LADM — Parte 3: Parcelas 3D', color: 'border-violet-500', icon: '🧊',
    desc: 'Extiende el LADM para el manejo de catastro tridimensional. Permite representar derechos sobre espacios aéreos, subsuelos, propiedades horizontales y cualquier objeto espacial con extensión 3D.' },
  { code: 'ISO 19152-4:2025', title: 'LADM — Parte 4: Valuación', color: 'border-emerald-500', icon: '💰',
    desc: 'Define el perfil del LADM para procesos de valoración catastral y fiscal de la propiedad inmueble. Establece atributos, métodos de avalúo y la vinculación entre la información catastral y el valor del suelo.' },
  { code: 'ISO 19152-5:2025', title: 'LADM — Parte 5: Gestión espacial y urbana', color: 'border-amber-500', icon: '🏙️',
    desc: 'Aborda la gestión del territorio desde la planificación urbana y el ordenamiento territorial. Incluye modelos para zonas de uso del suelo, servidumbres, instrumentos de gestión del suelo y regulaciones urbanísticas.' },
];

const XTF_EXAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Ejemplo mínimo de archivo XTF (INTERLIS Transfer Format) -->
<!-- Modelo: LADM_COL_SINIC_V1_0 — SRID 9377 -->
<TRANSFER xmlns="http://www.interlis.ch/INTERLIS2.3">
  <HEADERSECTION>
    <MODELS>
      <MODEL NAME="LADM_COL_SINIC_V1_0"
             URI="https://www.igac.gov.co/modelo/LADM_COL_SINIC_V1_0.ili"
             VERSION="1.0"/>
    </MODELS>
  </HEADERSECTION>
  <DATASECTION>
    <!-- Unidad Administrativa (col_baunit) -->
    <LADM_COL_SINIC_V1_0.col_baunit TID="u1">
      <T_Ili_Tid>a1b2c3d4-e5f6-7890-abcd-ef1234567890</T_Ili_Tid>
      <Nombre>Predio Los Rosales</Nombre>
      <Tipo>Predio</Tipo>
      <Departamento>Cundinamarca</Departamento>
      <Municipio>Bogota D.C.</Municipio>
    </LADM_COL_SINIC_V1_0.col_baunit>

    <!-- Unidad Espacial (col_terreno) -->
    <LADM_COL_SINIC_V1_0.col_terreno TID="t1">
      <T_Ili_Tid>f0e9d8c7-b6a5-4321-fedc-ba0987654321</T_Ili_Tid>
      <Area_Calculada>1500.0000</Area_Calculada>
      <Dimension>2D</Dimension>
      <Geometria>
        <COORD>
          <C1>1013500.25</C1><C2>1007200.80</C2>
        </COORD>
      </Geometria>
    </LADM_COL_SINIC_V1_0.col_terreno>

    <!-- Interesado (col_interesado) -->
    <LADM_COL_SINIC_V1_0.col_interesado TID="i1">
      <T_Ili_Tid>12345678-abcd-ef01-2345-678901234567</T_Ili_Tid>
      <Nombre>Ana María Gomez Torres</Nombre>
      <Tipo_Documento>CC</Tipo_Documento>
      <Numero_Documento>52890123</Numero_Documento>
      <Tipo_Interesado>natural</Tipo_Interesado>
    </LADM_COL_SINIC_V1_0.col_interesado>
  </DATASECTION>
</TRANSFER>`;

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden">
      <button className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors" onClick={() => setOpen(!open)}>
        <span className="font-semibold text-white text-sm">{title}</span>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-4 text-gray-300 text-sm leading-relaxed border-t border-gray-800 pt-3">{children}</div>}
    </div>
  );
}

export default function AprendeSINIC() {
  const [tab, setTab] = useState<Tab>('resolucion');

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
            <BookOpen size={12} /> Sistema Nacional de Información Catastral
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Aprende SINIC</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Guía educativa sobre la Resolución 301 de 2025, los estándares ISO 19152 y el formato INTERLIS/XTF.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-900 p-1.5 rounded-xl border border-gray-800">
          {([
            { id: 'resolucion', label: 'Resolución 301 de 2025', icon: Scale },
            { id: 'iso',        label: 'Estándares ISO 19152',  icon: Globe },
            { id: 'interlis',   label: 'INTERLIS / XTF',        icon: FileCode },
          ] as { id: Tab; label: string; icon: typeof Scale }[]).map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${tab === id ? 'bg-navy-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <Icon size={14} /><span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab: Resolución 301 */}
        {tab === 'resolucion' && (
          <div className="animate-fade-in space-y-6">
            <div className="card p-6 border-l-4 border-navy-600">
              <h2 className="text-white font-bold text-xl mb-2">¿Qué es el SINIC?</h2>
              <p className="text-gray-300 leading-relaxed">
                El <strong className="text-white">Sistema Nacional de Información Catastral (SINIC)</strong> es la infraestructura tecnológica y normativa que permite la gestión integrada, estandarizada e interoperable de la información catastral en Colombia, conforme a la <strong className="text-emerald-400">Resolución 301 de 2025</strong> del Instituto Geográfico Agustín Codazzi (IGAC). Implementa el perfil colombiano del estándar internacional LADM (ISO 19152) para el catastro multipropósito.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[['🏛️','Base Legal','Resolución 301 de 2025'],['📐','Estándar','LADM_COL SINIC V1.0'],['🗺️','SRID','9377 - Magna Sirgas']].map(([icon, label, val]) => (
                  <div key={label} className="bg-white/5 rounded-lg p-3">
                    <div className="text-2xl mb-1">{icon}</div>
                    <div className="text-gray-400 text-xs">{label}</div>
                    <div className="text-white text-xs font-semibold mt-0.5">{val}</div>
                  </div>
                ))}
              </div>
            </div>

            <h2 className="text-white font-semibold text-lg">Artículo de Definiciones — Términos Clave</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DEFINICIONES.map(({ term, def }) => (
                <div key={term} className="definition-card">
                  <h3 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />{term}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{def}</p>
                </div>
              ))}
            </div>

            <div className="card p-5">
              <h2 className="text-white font-semibold mb-3">Preguntas Frecuentes</h2>
              <div className="space-y-2">
                <Accordion title="¿Quién puede ser Gestor Catastral?">
                  Pueden ser gestores catastrales los entes territoriales (municipios), empresas de servicios públicos habilitadas y personas jurídicas privadas que cumplan los requisitos técnicos y financieros establecidos por el IGAC. Deben estar inscritas en el Registro de Gestores Catastrales.
                </Accordion>
                <Accordion title="¿Cómo se identifica un predio en el SINIC?">
                  Mediante el <strong>número predial único nacional</strong> (NPN), compuesto por 30 dígitos que codifican: departamento, municipio, zona, sector, manzana, número de predio y condición. Adicionalmente se usa el UUID t_ili_tid para interoperabilidad con INTERLIS.
                </Accordion>
                <Accordion title="¿Qué es el catastro multipropósito?">
                  Es la evolución del catastro tradicional hacia un sistema que no sólo registra información fiscal del suelo, sino también información legal, física y económica de los predios, permitiendo múltiples usos: ordenamiento territorial, gestión de riesgos, planeación urbana y rural, entre otros.
                </Accordion>
              </div>
            </div>
          </div>
        )}

        {/* Tab: ISO 19152 */}
        {tab === 'iso' && (
          <div className="animate-fade-in space-y-4">
            <div className="card p-5 mb-6">
              <p className="text-gray-300 text-sm leading-relaxed">
                La familia de normas <strong className="text-white">ISO 19152</strong> define el <em>Land Administration Domain Model (LADM)</em>, un modelo conceptual internacional para la administración territorial. Colombia implementa estas normas a través de <strong className="text-emerald-400">LADM_COL</strong> y sus submodelos específicos como SINIC.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {ISO_STANDARDS.map(({ code, title, color, icon, desc }) => (
                <div key={code} className={`iso-card border-l-4 ${color} p-5`}>
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="badge bg-gray-800 text-gray-300 font-mono text-xs">{code}</span>
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
                      <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: INTERLIS */}
        {tab === 'interlis' && (
          <div className="animate-fade-in space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="card p-5 border-l-4 border-blue-500">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <FileCode size={16} className="text-blue-400" /> ¿Qué es INTERLIS?
                </h3>
                <p className="text-gray-300 text-xs leading-relaxed">
                  <strong className="text-white">INTERLIS</strong> es un lenguaje de modelado de datos geoespaciales desarrollado en Suiza, diseñado para definir modelos de datos de forma neutra a la plataforma y al software. Permite describir la estructura, semántica y restricciones de datos geográficos de manera formal y verificable. En Colombia, el IGAC lo usa para definir los modelos LADM_COL en archivos <code className="bg-gray-800 px-1 rounded text-xs">.ili</code>.
                </p>
              </div>
              <div className="card p-5 border-l-4 border-emerald-500">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <FileCode size={16} className="text-emerald-400" /> ¿Qué es el formato XTF?
                </h3>
                <p className="text-gray-300 text-xs leading-relaxed">
                  El <strong className="text-white">XTF (INTERLIS Transfer Format)</strong> es un archivo XML estructurado que permite la transferencia de datos conformes a un modelo INTERLIS. Cada registro está etiquetado con el nombre de la clase y los atributos del modelo, facilitando la validación automática. Es el formato oficial de intercambio del SINIC entre gestores catastrales.
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">Ejemplo mínimo de archivo XTF</h3>
                <span className="badge bg-gray-800 text-gray-400 text-xs">LADM_COL_SINIC_V1_0</span>
              </div>
              <div className="card overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700">
                  <div className="w-3 h-3 rounded-full bg-red-500 opacity-75" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-75" />
                  <div className="w-3 h-3 rounded-full bg-green-500 opacity-75" />
                  <span className="ml-2 text-gray-400 text-xs font-mono">sinic_ejemplo.xtf</span>
                </div>
                <pre className="p-4 overflow-x-auto text-xs leading-relaxed">
                  {XTF_EXAMPLE.split('\n').map((line, i) => {
                    let cls = 'text-gray-300';
                    if (line.trim().startsWith('<!--')) cls = 'text-gray-500 italic';
                    else if (line.includes('<?xml') || line.includes('TRANSFER') || line.includes('HEADER') || line.includes('DATA')) cls = 'text-blue-400';
                    else if (line.includes('<MODEL') || line.includes('LADM_COL')) cls = 'text-emerald-400';
                    else if (line.match(/<[A-Z]/)) cls = 'text-yellow-300';
                    else if (line.match(/<[a-z]/)) cls = 'text-purple-300';
                    return <span key={i} className={`block ${cls}`}>{line}</span>;
                  })}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
