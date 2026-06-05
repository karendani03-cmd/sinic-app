import { useEffect, useRef, useState } from 'react';
import { MapPin, Type } from 'lucide-react';

interface Props {
  value: string;
  onChange: (wkt: string) => void;
  label?: string;
  geometryType?: 'point' | 'polygon' | 'linestring';
}

// Centrado en Colombia (WGS84) — se usará sólo para referencia visual
const COLOMBIA_CENTER: [number, number] = [4.5709, -74.2973];

export default function MapInput({ value, onChange, label = 'Geometría (WKT)', geometryType = 'polygon' }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<unknown>(null);
  const [mode, setMode] = useState<'wkt' | 'map'>('wkt');
  const [localWkt, setLocalWkt] = useState(value || '');

  // Commit WKT change upward
  const handleWktChange = (v: string) => {
    setLocalWkt(v);
    onChange(v);
  };

  useEffect(() => {
    setLocalWkt(value || '');
  }, [value]);

  // Initialize Leaflet map lazily when tab "map" is selected
  useEffect(() => {
    if (mode !== 'map' || !mapRef.current || mapInstance.current) return;

    import('leaflet').then(L => {
      const map = L.map(mapRef.current!, { center: COLOMBIA_CENTER, zoom: 6 });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      // Click to generate WKT point
      map.on('click', (e: { latlng: { lat: number; lng: number } }) => {
        const { lat, lng } = e.latlng;
        if (geometryType === 'point') {
          const wkt = `POINT(${lng.toFixed(6)} ${lat.toFixed(6)})`;
          setLocalWkt(wkt);
          onChange(wkt);
        }
      });

      mapInstance.current = map;
    });

    return () => {
      if (mapInstance.current) {
        (mapInstance.current as { remove: () => void }).remove();
        mapInstance.current = null;
      }
    };
  }, [mode, geometryType, onChange]);

  const placeholder: Record<string, string> = {
    point:      'POINT(lng lat) — Ej: POINT(-74.0821 4.6097)',
    polygon:    'POLYGON((x1 y1, x2 y2, x3 y3, x1 y1)) — coordenadas en SRID 9377',
    linestring: 'LINESTRING(x1 y1, x2 y2, x3 y3) — coordenadas en SRID 9377',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="label">{label}</label>
        <div className="flex rounded-lg overflow-hidden border border-gray-700 text-xs">
          <button
            type="button"
            onClick={() => setMode('wkt')}
            className={`flex items-center gap-1 px-3 py-1.5 transition-all ${
              mode === 'wkt' ? 'bg-navy-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Type size={11} /> WKT
          </button>
          <button
            type="button"
            onClick={() => setMode('map')}
            className={`flex items-center gap-1 px-3 py-1.5 transition-all ${
              mode === 'map' ? 'bg-navy-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <MapPin size={11} /> Mapa
          </button>
        </div>
      </div>

      {mode === 'wkt' ? (
        <textarea
          className="input-field resize-none font-mono text-xs"
          rows={3}
          placeholder={placeholder[geometryType]}
          value={localWkt}
          onChange={e => handleWktChange(e.target.value)}
        />
      ) : (
        <div className="space-y-2">
          <div
            ref={mapRef}
            className="w-full rounded-lg overflow-hidden border border-gray-700"
            style={{ height: 260 }}
          />
          {geometryType === 'point' && (
            <p className="text-xs text-gray-500">Haz clic en el mapa para seleccionar un punto.</p>
          )}
          {(geometryType === 'polygon' || geometryType === 'linestring') && (
            <p className="text-xs text-gray-500">
              Para polígonos/líneas, escribe el WKT manualmente en la pestaña WKT.
            </p>
          )}
          {localWkt && (
            <div className="bg-gray-800 rounded-lg px-3 py-2 font-mono text-xs text-emerald-400 break-all">
              {localWkt}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
