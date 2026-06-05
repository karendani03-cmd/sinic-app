import { useState, useEffect, useCallback } from 'react';
import CRUDTable, { type Column } from '../CRUDTable';
import CRUDModal from '../CRUDModal';
import MapInput from '../MapInput';
import { useToast } from '../Toast';
import { terrenoApi, linderoApi } from '../../services/api';
import type { ColTerreno, ColTerrenoCreate, ColLindero, ColLinderoCreate } from '../../types';

type SubTab = 'terrenos' | 'linderos';

const terrenoColumns: Column<ColTerreno>[] = [
  { key: 'area_calculada', label: 'Área (m²)' },
  { key: 'dimension', label: 'Dimensión', render: r => (
    <span className={`badge ${r.dimension === '3D' ? 'bg-purple-900/50 text-purple-300' : 'bg-blue-900/50 text-blue-300'}`}>{r.dimension || '—'}</span>
  )},
  { key: 'geometria', label: 'WKT', render: r => (
    <span className="font-mono text-xs text-gray-500 truncate block max-w-[200px]" title={r.geometria}>{r.geometria?.slice(0, 30) || '—'}</span>
  )},
];

const linderoColumns: Column<ColLindero>[] = [
  { key: 'longitud',  label: 'Longitud (m)' },
  { key: 'dimension', label: 'Dimensión', render: r => (
    <span className={`badge ${r.dimension === '3D' ? 'bg-purple-900/50 text-purple-300' : 'bg-blue-900/50 text-blue-300'}`}>{r.dimension || '—'}</span>
  )},
  { key: 'geometria', label: 'WKT', render: r => (
    <span className="font-mono text-xs text-gray-500 truncate block max-w-[200px]" title={r.geometria}>{r.geometria?.slice(0, 30) || '—'}</span>
  )},
];

export default function UnidadEspacial() {
  const [tab, setTab]           = useState<SubTab>('terrenos');
  const [terrenos, setTerrenos] = useState<ColTerreno[]>([]);
  const [linderos, setLinderos] = useState<ColLindero[]>([]);
  const [loading, setLoading]   = useState(false);
  const [skip, setSkip]         = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]   = useState<(ColTerreno | ColLindero) | null>(null);
  const [formT, setFormT]       = useState<ColTerrenoCreate>({ area_calculada: undefined, dimension: '', geometria: '' });
  const [formL, setFormL]       = useState<ColLinderoCreate>({ longitud: undefined, dimension: '', geometria: '' });
  const [saving, setSaving]     = useState(false);
  const { showToast }           = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === 'terrenos') setTerrenos(await terrenoApi.list(skip, 100));
      else setLinderos(await linderoApi.list(skip, 100));
    } catch { showToast('Error al cargar datos', 'error'); }
    finally { setLoading(false); }
  }, [tab, skip, showToast]);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditing(null);
    if (tab === 'terrenos') setFormT({ area_calculada: undefined, dimension: '', geometria: '' });
    else setFormL({ longitud: undefined, dimension: '', geometria: '' });
    setModalOpen(true);
  };
  const openEdit = (row: ColTerreno | ColLindero) => {
    setEditing(row);
    if (tab === 'terrenos') {
      const r = row as ColTerreno;
      setFormT({ area_calculada: r.area_calculada, dimension: r.dimension, geometria: r.geometria });
    } else {
      const r = row as ColLindero;
      setFormL({ longitud: r.longitud, dimension: r.dimension, geometria: r.geometria });
    }
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (tab === 'terrenos') {
        editing ? await terrenoApi.update(editing.t_id, formT) : await terrenoApi.create(formT);
      } else {
        editing ? await linderoApi.update(editing.t_id, formL) : await linderoApi.create(formL);
      }
      showToast(`${tab === 'terrenos' ? 'Terreno' : 'Lindero'} ${editing ? 'actualizado' : 'creado'}`, 'success');
      closeModal(); load();
    } catch (e: unknown) {
      showToast((e as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Error al guardar', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (row: ColTerreno | ColLindero) => {
    const label = tab === 'terrenos' ? 'terreno' : 'lindero';
    if (!confirm(`¿Eliminar ${label} t_id=${row.t_id}?`)) return;
    try {
      if (tab === 'terrenos') await terrenoApi.remove(row.t_id);
      else await linderoApi.remove(row.t_id);
      showToast('Eliminado', 'success'); load();
    } catch { showToast('Error al eliminar', 'error'); }
  };

  const DIMS = ['2D', '3D'];

  return (
    <>
      {/* Sub-tabs */}
      <div className="flex gap-2 mb-5">
        <button onClick={() => { setTab('terrenos'); setSkip(0); }} className={tab === 'terrenos' ? 'tab-btn-active' : 'tab-btn'}>Terrenos</button>
        <button onClick={() => { setTab('linderos'); setSkip(0); }} className={tab === 'linderos' ? 'tab-btn-active' : 'tab-btn'}>Linderos</button>
      </div>

      {tab === 'terrenos' ? (
        <CRUDTable
          title="Unidades Espaciales — Terrenos (col_terreno)"
          columns={terrenoColumns} data={terrenos} loading={loading}
          onNew={openNew} onEdit={openEdit} onDelete={handleDelete}
          onRefresh={load} skip={skip} limit={100} onPageChange={setSkip}
        />
      ) : (
        <CRUDTable
          title="Unidades Espaciales — Linderos (col_lindero)"
          columns={linderoColumns} data={linderos} loading={loading}
          onNew={openNew} onEdit={openEdit} onDelete={handleDelete}
          onRefresh={load} skip={skip} limit={100} onPageChange={setSkip}
        />
      )}

      <CRUDModal
        isOpen={modalOpen}
        title={editing ? `Editar ${tab === 'terrenos' ? 'Terreno' : 'Lindero'}` : `Nuevo ${tab === 'terrenos' ? 'Terreno' : 'Lindero'}`}
        onClose={closeModal}
      >
        {tab === 'terrenos' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Área Calculada (m²)</label>
              <input type="number" step="0.0001" className="input-field" placeholder="1500.0000"
                value={formT.area_calculada ?? ''} onChange={e => setFormT(f => ({ ...f, area_calculada: e.target.value ? +e.target.value : undefined }))} />
            </div>
            <div>
              <label className="label">Dimensión</label>
              <select className="input-field" value={formT.dimension || ''} onChange={e => setFormT(f => ({ ...f, dimension: e.target.value }))}>
                <option value="">— Seleccionar —</option>
                {DIMS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <MapInput label="Geometría Polígono (SRID 9377)" geometryType="polygon" value={formT.geometria || ''} onChange={v => setFormT(f => ({ ...f, geometria: v }))} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Longitud (m)</label>
              <input type="number" step="0.0001" className="input-field" placeholder="85.2000"
                value={formL.longitud ?? ''} onChange={e => setFormL(f => ({ ...f, longitud: e.target.value ? +e.target.value : undefined }))} />
            </div>
            <div>
              <label className="label">Dimensión</label>
              <select className="input-field" value={formL.dimension || ''} onChange={e => setFormL(f => ({ ...f, dimension: e.target.value }))}>
                <option value="">— Seleccionar —</option>
                {DIMS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <MapInput label="Geometría Línea (SRID 9377)" geometryType="linestring" value={formL.geometria || ''} onChange={v => setFormL(f => ({ ...f, geometria: v }))} />
            </div>
          </div>
        )}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
          <button onClick={closeModal} className="btn-ghost">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? 'Guardando…' : editing ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </CRUDModal>
    </>
  );
}
