import { useState, useEffect, useCallback } from 'react';
import CRUDTable, { type Column } from '../CRUDTable';
import CRUDModal from '../CRUDModal';
import { useToast } from '../Toast';
import { baunitApi } from '../../services/api';
import type { ColBaunit, ColBaunitCreate } from '../../types';

const TIPOS = ['Predio', 'Terreno', 'Unidad', 'Mejora', 'Via', 'Cuerpo de Agua'];

const columns: Column<ColBaunit>[] = [
  { key: 'nombre',       label: 'Nombre' },
  { key: 'tipo',         label: 'Tipo' },
  { key: 'departamento', label: 'Departamento' },
  { key: 'municipio',    label: 'Municipio' },
  { key: 't_ili_tid',    label: 'ILI TID', render: r => <span className="font-mono text-xs text-gray-500">{r.t_ili_tid?.slice(0, 8)}…</span> },
];

const emptyForm: ColBaunitCreate = { nombre: '', tipo: '', departamento: '', municipio: '' };

export default function UnidadAdministrativa() {
  const [data, setData]       = useState<ColBaunit[]>([]);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip]       = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ColBaunit | null>(null);
  const [form, setForm]       = useState<ColBaunitCreate>(emptyForm);
  const [saving, setSaving]   = useState(false);
  const { showToast }         = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await baunitApi.list(skip, 100));
    } catch { showToast('Error al cargar Unidades Administrativas', 'error'); }
    finally { setLoading(false); }
  }, [skip, showToast]);

  useEffect(() => { load(); }, [load]);

  const openNew  = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (row: ColBaunit) => { setEditing(row); setForm({ nombre: row.nombre, tipo: row.tipo, departamento: row.departamento, municipio: row.municipio }); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await baunitApi.update(editing.t_id, form);
        showToast('Unidad Administrativa actualizada', 'success');
      } else {
        await baunitApi.create(form);
        showToast('Unidad Administrativa creada', 'success');
      }
      closeModal(); load();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Error al guardar';
      showToast(msg, 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (row: ColBaunit) => {
    if (!confirm(`¿Eliminar la Unidad Administrativa "${row.nombre || row.t_id}"?`)) return;
    try {
      await baunitApi.remove(row.t_id);
      showToast('Registro eliminado', 'success'); load();
    } catch { showToast('Error al eliminar', 'error'); }
  };

  const F = (k: keyof ColBaunitCreate, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <CRUDTable
        title="Unidades Administrativas (col_baunit)"
        columns={columns} data={data} loading={loading}
        onNew={openNew} onEdit={openEdit} onDelete={handleDelete}
        onRefresh={load} skip={skip} limit={100} onPageChange={setSkip}
      />
      <CRUDModal isOpen={modalOpen} title={editing ? 'Editar Unidad Administrativa' : 'Nueva Unidad Administrativa'} onClose={closeModal}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label">Nombre</label>
            <input className="input-field" placeholder="Nombre del predio o unidad" value={form.nombre || ''} onChange={e => F('nombre', e.target.value)} />
          </div>
          <div>
            <label className="label">Tipo</label>
            <select className="input-field" value={form.tipo || ''} onChange={e => F('tipo', e.target.value)}>
              <option value="">— Seleccionar —</option>
              {TIPOS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Departamento</label>
            <input className="input-field" placeholder="Ej: Cundinamarca" value={form.departamento || ''} onChange={e => F('departamento', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="label">Municipio</label>
            <input className="input-field" placeholder="Ej: Bogotá D.C." value={form.municipio || ''} onChange={e => F('municipio', e.target.value)} />
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
