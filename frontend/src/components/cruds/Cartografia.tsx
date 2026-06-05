import { useState, useEffect, useCallback } from 'react';
import CRUDTable, { type Column } from '../CRUDTable';
import CRUDModal from '../CRUDModal';
import MapInput from '../MapInput';
import { useToast } from '../Toast';
import { construccionApi, unidadConstruccionApi } from '../../services/api';
import type { CcConstruccion, CcConstruccionCreate, CcUnidadConstruccion } from '../../types';

type SubTab = 'construcciones' | 'unidades';

const constColumns: Column<CcConstruccion>[] = [
  { key: 'tipo_construccion', label: 'Tipo Construcción' },
  { key: 'tipo_dominio',      label: 'Tipo Dominio' },
  { key: 'numero_pisos',      label: 'Pisos' },
  { key: 'geometria', label: 'WKT', render: r => (
    <span className="font-mono text-xs text-gray-500 truncate block max-w-[160px]" title={r.geometria}>{r.geometria?.slice(0, 25) || '—'}</span>
  )},
];

const unidColumns: Column<CcUnidadConstruccion>[] = [
  { key: 'tipo_construccion', label: 'Tipo Construcción' },
  { key: 'tipo_dominio',      label: 'Tipo Dominio' },
  { key: 'numero_pisos',      label: 'Pisos' },
  { key: 'geometria', label: 'WKT', render: r => (
    <span className="font-mono text-xs text-gray-500 truncate block max-w-[160px]" title={r.geometria}>{r.geometria?.slice(0, 25) || '—'}</span>
  )},
];

const TIPOS_CONSTR = ['Convencional', 'No Convencional', 'Infraestructura'];
const TIPOS_DOM    = ['Privado', 'Público', 'Mixto'];
const emptyForm    = { tipo_construccion: '', tipo_dominio: '', numero_pisos: undefined as number | undefined, geometria: '' };

export default function Cartografia() {
  const [tab, setTab]             = useState<SubTab>('construcciones');
  const [construcciones, setConstr] = useState<CcConstruccion[]>([]);
  const [unidades, setUnidades]   = useState<CcUnidadConstruccion[]>([]);
  const [loading, setLoading]     = useState(false);
  const [skip, setSkip]           = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState<(CcConstruccion | CcUnidadConstruccion) | null>(null);
  const [form, setForm]           = useState(emptyForm);
  const [saving, setSaving]       = useState(false);
  const { showToast }             = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === 'construcciones') setConstr(await construccionApi.list(skip, 100));
      else setUnidades(await unidadConstruccionApi.list(skip, 100));
    } catch { showToast('Error al cargar cartografía', 'error'); }
    finally { setLoading(false); }
  }, [tab, skip, showToast]);

  useEffect(() => { load(); }, [load]);

  const openNew = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (row: CcConstruccion | CcUnidadConstruccion) => {
    setEditing(row);
    setForm({ tipo_construccion: row.tipo_construccion || '', tipo_dominio: row.tipo_dominio || '', numero_pisos: row.numero_pisos, geometria: row.geometria || '' });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleSave = async () => {
    setSaving(true);
    const payload: CcConstruccionCreate = { ...form };
    try {
      if (tab === 'construcciones') {
        editing ? await construccionApi.update(editing.t_id, payload) : await construccionApi.create(payload);
      } else {
        editing ? await unidadConstruccionApi.update(editing.t_id, payload) : await unidadConstruccionApi.create(payload);
      }
      showToast(`${tab === 'construcciones' ? 'Construcción' : 'Unidad de Construcción'} ${editing ? 'actualizada' : 'creada'}`, 'success');
      closeModal(); load();
    } catch (e: unknown) {
      showToast((e as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Error al guardar', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (row: CcConstruccion | CcUnidadConstruccion) => {
    if (!confirm(`¿Eliminar t_id=${row.t_id}?`)) return;
    try {
      if (tab === 'construcciones') await construccionApi.remove(row.t_id);
      else await unidadConstruccionApi.remove(row.t_id);
      showToast('Eliminado', 'success'); load();
    } catch { showToast('Error al eliminar', 'error'); }
  };

  const F = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <div className="flex gap-2 mb-5">
        <button onClick={() => { setTab('construcciones'); setSkip(0); }} className={tab === 'construcciones' ? 'tab-btn-active' : 'tab-btn'}>Construcciones</button>
        <button onClick={() => { setTab('unidades'); setSkip(0); }} className={tab === 'unidades' ? 'tab-btn-active' : 'tab-btn'}>Unidades de Construcción</button>
      </div>

      {tab === 'construcciones' ? (
        <CRUDTable title="Cartografía — Construcciones (cc_construccion)"
          columns={constColumns} data={construcciones} loading={loading}
          onNew={openNew} onEdit={openEdit} onDelete={handleDelete}
          onRefresh={load} skip={skip} limit={100} onPageChange={setSkip} />
      ) : (
        <CRUDTable title="Cartografía — Unidades de Construcción (cc_unidadconstruccion)"
          columns={unidColumns} data={unidades} loading={loading}
          onNew={openNew} onEdit={openEdit} onDelete={handleDelete}
          onRefresh={load} skip={skip} limit={100} onPageChange={setSkip} />
      )}

      <CRUDModal isOpen={modalOpen} title={editing ? 'Editar' : 'Nueva'} onClose={closeModal}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Tipo de Construcción</label>
            <select className="input-field" value={form.tipo_construccion} onChange={e => F('tipo_construccion', e.target.value)}>
              <option value="">— Seleccionar —</option>
              {TIPOS_CONSTR.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Tipo de Dominio</label>
            <select className="input-field" value={form.tipo_dominio} onChange={e => F('tipo_dominio', e.target.value)}>
              <option value="">— Seleccionar —</option>
              {TIPOS_DOM.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="label">Número de Pisos</label>
            <input type="number" min="1" max="200" className="input-field" placeholder="1"
              value={form.numero_pisos ?? ''} onChange={e => F('numero_pisos', e.target.value ? +e.target.value : undefined)} />
          </div>
          <div className="col-span-2">
            <MapInput label="Geometría Polígono (SRID 9377)" geometryType="polygon" value={form.geometria} onChange={v => F('geometria', v)} />
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
