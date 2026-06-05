import { useState, useEffect, useCallback } from 'react';
import CRUDTable, { type Column } from '../CRUDTable';
import CRUDModal from '../CRUDModal';
import MapInput from '../MapInput';
import { useToast } from '../Toast';
import { puntoApi } from '../../services/api';
import type { ColPunto, ColPuntoCreate } from '../../types';

const METODOS = ['GNSS', 'Estación Total', 'Fotogrametría', 'LiDAR', 'Digitalización', 'Otro'];

const columns: Column<ColPunto>[] = [
  { key: 'exactitud_horizontal', label: 'Exactitud H (m)' },
  { key: 'exactitud_vertical',   label: 'Exactitud V (m)' },
  { key: 'metodo_produccion',    label: 'Método' },
  { key: 'posicion_interpolacion', label: 'Geometría WKT', render: r => (
    <span className="font-mono text-xs text-gray-500 truncate block max-w-[200px]" title={r.posicion_interpolacion}>
      {r.posicion_interpolacion || '—'}
    </span>
  )},
];

const emptyForm: ColPuntoCreate = { exactitud_horizontal: undefined, exactitud_vertical: undefined, metodo_produccion: '', posicion_interpolacion: '' };

export default function Topografia() {
  const [data, setData]       = useState<ColPunto[]>([]);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip]       = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ColPunto | null>(null);
  const [form, setForm]       = useState<ColPuntoCreate>(emptyForm);
  const [saving, setSaving]   = useState(false);
  const { showToast }         = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try { setData(await puntoApi.list(skip, 100)); }
    catch { showToast('Error al cargar puntos topográficos', 'error'); }
    finally { setLoading(false); }
  }, [skip, showToast]);

  useEffect(() => { load(); }, [load]);

  const openNew  = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (r: ColPunto) => {
    setEditing(r);
    setForm({ exactitud_horizontal: r.exactitud_horizontal, exactitud_vertical: r.exactitud_vertical, metodo_produccion: r.metodo_produccion, posicion_interpolacion: r.posicion_interpolacion });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleSave = async () => {
    setSaving(true);
    try {
      editing ? await puntoApi.update(editing.t_id, form) : await puntoApi.create(form);
      showToast(`Punto ${editing ? 'actualizado' : 'creado'}`, 'success');
      closeModal(); load();
    } catch (e: unknown) {
      showToast((e as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Error al guardar', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (r: ColPunto) => {
    if (!confirm(`¿Eliminar punto t_id=${r.t_id}?`)) return;
    try { await puntoApi.remove(r.t_id); showToast('Eliminado', 'success'); load(); }
    catch { showToast('Error al eliminar', 'error'); }
  };

  return (
    <>
      <CRUDTable
        title="Topografía y Representación (col_punto)"
        columns={columns} data={data} loading={loading}
        onNew={openNew} onEdit={openEdit} onDelete={handleDelete}
        onRefresh={load} skip={skip} limit={100} onPageChange={setSkip}
      />
      <CRUDModal isOpen={modalOpen} title={editing ? 'Editar Punto Topográfico' : 'Nuevo Punto Topográfico'} onClose={closeModal}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Exactitud Horizontal (m)</label>
            <input type="number" step="0.001" className="input-field" placeholder="0.050"
              value={form.exactitud_horizontal ?? ''} onChange={e => setForm(f => ({ ...f, exactitud_horizontal: e.target.value ? +e.target.value : undefined }))} />
          </div>
          <div>
            <label className="label">Exactitud Vertical (m)</label>
            <input type="number" step="0.001" className="input-field" placeholder="0.100"
              value={form.exactitud_vertical ?? ''} onChange={e => setForm(f => ({ ...f, exactitud_vertical: e.target.value ? +e.target.value : undefined }))} />
          </div>
          <div className="col-span-2">
            <label className="label">Método de Producción</label>
            <select className="input-field" value={form.metodo_produccion || ''} onChange={e => setForm(f => ({ ...f, metodo_produccion: e.target.value }))}>
              <option value="">— Seleccionar —</option>
              {METODOS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <MapInput
              label="Posición de Interpolación (SRID 9377)"
              geometryType="point"
              value={form.posicion_interpolacion || ''}
              onChange={v => setForm(f => ({ ...f, posicion_interpolacion: v }))}
            />
          </div>
        </div>
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
