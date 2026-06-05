import { useState, useEffect, useCallback } from 'react';
import CRUDTable, { type Column } from '../CRUDTable';
import CRUDModal from '../CRUDModal';
import { useToast } from '../Toast';
import { interesadoApi } from '../../services/api';
import type { ColInteresado, ColInteresadoCreate } from '../../types';

const TIPOS_DOC = ['CC', 'NIT', 'CE', 'PA', 'TI', 'RC', 'DE'];
const TIPOS_INT = ['natural', 'juridico'];

const columns: Column<ColInteresado>[] = [
  { key: 'nombre',          label: 'Nombre' },
  { key: 'tipo_documento',  label: 'Tipo Doc.' },
  { key: 'numero_documento',label: 'N° Documento' },
  { key: 'tipo_interesado', label: 'Tipo', render: r => (
    <span className={`badge ${r.tipo_interesado === 'natural' ? 'bg-blue-900/50 text-blue-300' : 'bg-purple-900/50 text-purple-300'}`}>
      {r.tipo_interesado}
    </span>
  )},
];

const emptyForm: ColInteresadoCreate = { nombre: '', tipo_documento: '', numero_documento: '', tipo_interesado: '' };

export default function Interesados() {
  const [data, setData]       = useState<ColInteresado[]>([]);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip]       = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ColInteresado | null>(null);
  const [form, setForm]       = useState<ColInteresadoCreate>(emptyForm);
  const [saving, setSaving]   = useState(false);
  const { showToast }         = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try { setData(await interesadoApi.list(skip, 100)); }
    catch { showToast('Error al cargar interesados', 'error'); }
    finally { setLoading(false); }
  }, [skip, showToast]);

  useEffect(() => { load(); }, [load]);

  const openNew  = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (r: ColInteresado) => {
    setEditing(r);
    setForm({ nombre: r.nombre, tipo_documento: r.tipo_documento, numero_documento: r.numero_documento, tipo_interesado: r.tipo_interesado });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleSave = async () => {
    if (!form.nombre) { showToast('El nombre es requerido', 'error'); return; }
    setSaving(true);
    try {
      editing ? await interesadoApi.update(editing.t_id, form) : await interesadoApi.create(form);
      showToast(`Interesado ${editing ? 'actualizado' : 'creado'}`, 'success');
      closeModal(); load();
    } catch (e: unknown) {
      showToast((e as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Error al guardar', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (r: ColInteresado) => {
    if (!confirm(`¿Eliminar interesado "${r.nombre}"?`)) return;
    try { await interesadoApi.remove(r.t_id); showToast('Eliminado', 'success'); load(); }
    catch { showToast('Error al eliminar', 'error'); }
  };

  const F = (k: keyof ColInteresadoCreate, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <CRUDTable
        title="Interesados (col_interesado)"
        columns={columns} data={data} loading={loading}
        onNew={openNew} onEdit={openEdit} onDelete={handleDelete}
        onRefresh={load} skip={skip} limit={100} onPageChange={setSkip}
      />
      <CRUDModal isOpen={modalOpen} title={editing ? 'Editar Interesado' : 'Nuevo Interesado'} onClose={closeModal}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label">Nombre completo *</label>
            <input className="input-field" placeholder="Nombres y apellidos o razón social" value={form.nombre || ''} onChange={e => F('nombre', e.target.value)} />
          </div>
          <div>
            <label className="label">Tipo de Documento</label>
            <select className="input-field" value={form.tipo_documento || ''} onChange={e => F('tipo_documento', e.target.value)}>
              <option value="">— Seleccionar —</option>
              {TIPOS_DOC.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Número de Documento</label>
            <input className="input-field" placeholder="Ej: 1234567890" value={form.numero_documento || ''} onChange={e => F('numero_documento', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="label">Tipo de Interesado</label>
            <div className="flex gap-3">
              {TIPOS_INT.map(t => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="tipo_interesado" value={t} checked={form.tipo_interesado === t} onChange={() => F('tipo_interesado', t)} className="accent-navy-600" />
                  <span className="text-sm text-gray-300 capitalize">{t}</span>
                </label>
              ))}
            </div>
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
