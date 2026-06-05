export default function UMLDiagram() {
  const W = 900, H = 420;

  // Class box dimensions
  const classW = 220, headerH = 36, attrH = 26;

  // Positions (cx = center x, y = top y)
  const party  = { cx: 140,  y: 60,  attrs: ['+ ext_pid: String',    '+ party_type: PartyType', '+ role: RRRoleType'] };
  const baunit = { cx: 450,  y: 60,  attrs: ['+ ext_address_id: OID','+ name: CharacterString',  '+ type: BAUnitType'] };
  const spatial= { cx: 760,  y: 60,  attrs: ['+ area: Area',          '+ dimension: DimensionType','+ geometry: GM_Object'] };

  const boxH = (attrs: string[]) => headerH + attrs.length * attrH + 12;

  const renderClass = (name: string, stereotype: string, cx: number, y: number, attrs: string[], color: string) => {
    const x = cx - classW / 2;
    const h = boxH(attrs);
    return (
      <g key={name}>
        {/* Shadow */}
        <rect x={x + 3} y={y + 3} width={classW} height={h} rx={8} fill="rgba(0,0,0,0.4)" />
        {/* Body */}
        <rect x={x} y={y} width={classW} height={h} rx={8} fill="#111827" stroke={color} strokeWidth={1.5} />
        {/* Header */}
        <rect x={x} y={y} width={classW} height={headerH} rx={8} fill={color} />
        <rect x={x} y={y + headerH - 8} width={classW} height={8} fill={color} />
        {/* Stereotype */}
        <text x={cx} y={y + 13} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.7)" fontFamily="Inter, sans-serif">
          «{stereotype}»
        </text>
        {/* Class name */}
        <text x={cx} y={y + 28} textAnchor="middle" fontSize={12} fontWeight="700" fill="white" fontFamily="Inter, sans-serif">
          {name}
        </text>
        {/* Divider */}
        <line x1={x} y1={y + headerH} x2={x + classW} y2={y + headerH} stroke={color} strokeWidth={1} opacity={0.5} />
        {/* Attributes */}
        {attrs.map((attr, i) => (
          <text
            key={i}
            x={x + 10}
            y={y + headerH + 18 + i * attrH}
            fontSize={10}
            fill="#9ca3af"
            fontFamily="'JetBrains Mono', 'Courier New', monospace"
          >
            {attr}
          </text>
        ))}
      </g>
    );
  };

  // Association line endpoints
  const partyRight  = party.cx  + classW / 2;
  const baunitLeft  = baunit.cx - classW / 2;
  const baunitRight = baunit.cx + classW / 2;
  const spatialLeft = spatial.cx - classW / 2;

  const partyMidY   = party.y  + boxH(party.attrs)  / 2;
  const baunitMidY  = baunit.y + boxH(baunit.attrs) / 2;
  const spatialMidY = spatial.y + boxH(spatial.attrs) / 2;

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-800 bg-gray-950 p-2">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', minWidth: 600, height: 'auto' }}
        aria-label="Diagrama UML de clases SINIC"
      >
        {/* Grid background */}
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1f2937" strokeWidth="0.5" />
          </pattern>
          <marker id="arrowRight" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 Z" fill="#6366f1" />
          </marker>
          <marker id="arrowLeft" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto-start-reverse">
            <path d="M0,3 L6,0 L6,6 Z" fill="#10b981" />
          </marker>
        </defs>
        <rect width={W} height={H} fill="url(#grid)" />

        {/* Title */}
        <text x={W / 2} y={28} textAnchor="middle" fontSize={14} fontWeight="700" fill="#e5e7eb" fontFamily="Inter, sans-serif">
          Diagrama de Clases — Modelo LADM_COL SINIC V1.0
        </text>

        {/* Association: LA_Party ↔ LA_BAUnit */}
        <line
          x1={partyRight} y1={partyMidY}
          x2={baunitLeft} y2={baunitMidY}
          stroke="#6366f1" strokeWidth={1.5} strokeDasharray="6,3"
          markerEnd="url(#arrowRight)"
        />
        <text x={(partyRight + baunitLeft) / 2} y={partyMidY - 8} textAnchor="middle" fontSize={9} fill="#6366f1" fontFamily="Inter, sans-serif">
          interesado_en
        </text>
        <text x={partyRight + 8} y={partyMidY - 4} fontSize={9} fill="#6366f1" fontFamily="Inter, sans-serif">0..*</text>
        <text x={baunitLeft - 24} y={baunitMidY - 4} fontSize={9} fill="#6366f1" fontFamily="Inter, sans-serif">1..*</text>

        {/* Association: LA_BAUnit ↔ LA_SpatialUnit */}
        <line
          x1={baunitRight} y1={baunitMidY}
          x2={spatialLeft} y2={spatialMidY}
          stroke="#10b981" strokeWidth={1.5} strokeDasharray="6,3"
          markerEnd="url(#arrowLeft)"
        />
        <text x={(baunitRight + spatialLeft) / 2} y={baunitMidY - 8} textAnchor="middle" fontSize={9} fill="#10b981" fontFamily="Inter, sans-serif">
          unidad_espacial
        </text>
        <text x={baunitRight + 6} y={baunitMidY - 4} fontSize={9} fill="#10b981" fontFamily="Inter, sans-serif">1</text>
        <text x={spatialLeft - 24} y={spatialMidY - 4} fontSize={9} fill="#10b981" fontFamily="Inter, sans-serif">0..*</text>

        {/* Classes */}
        {renderClass('LA_Party',       'LADM_COL', party.cx,  party.y,  party.attrs,  '#4f46e5')}
        {renderClass('LA_BAUnit',      'LADM_COL', baunit.cx, baunit.y, baunit.attrs, '#0891b2')}
        {renderClass('LA_SpatialUnit', 'LADM_COL', spatial.cx, spatial.y, spatial.attrs, '#059669')}

        {/* Legend */}
        <g transform={`translate(20, ${H - 70})`}>
          <rect width={240} height={60} rx={6} fill="#111827" stroke="#374151" strokeWidth={1} />
          <text x={120} y={16} textAnchor="middle" fontSize={9} fontWeight="700" fill="#9ca3af" fontFamily="Inter, sans-serif">LEYENDA</text>
          <line x1={10} y1={28} x2={40} y2={28} stroke="#6366f1" strokeWidth={1.5} strokeDasharray="4,2" />
          <text x={46} y={32} fontSize={9} fill="#9ca3af" fontFamily="Inter, sans-serif">Asociación dirigida</text>
          <rect x={10} y={40} width={12} height={12} rx={2} fill="#4f46e5" />
          <text x={28} y={50} fontSize={9} fill="#9ca3af" fontFamily="Inter, sans-serif">Clase LADM_COL</text>
        </g>
      </svg>
    </div>
  );
}
