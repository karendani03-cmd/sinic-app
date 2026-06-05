import { Pencil, Trash2, Plus, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface Props<T extends { t_id: number }> {
  title: string;
  columns: Column<T>[];
  data: T[];
  loading: boolean;
  onNew: () => void;
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  onRefresh: () => void;
  skip: number;
  limit: number;
  onPageChange: (skip: number) => void;
}

export default function CRUDTable<T extends { t_id: number }>({
  title, columns, data, loading, onNew, onEdit, onDelete, onRefresh, skip, limit, onPageChange
}: Props<T>) {
  const getCellValue = (row: T, col: Column<T>) => {
    if (col.render) return col.render(row);
    const val = (row as Record<string, unknown>)[col.key as string];
    if (val === null || val === undefined) return <span className="text-gray-600 italic text-xs">—</span>;
    if (typeof val === 'string' && val.length > 60) return <span title={val}>{val.slice(0, 57)}…</span>;
    return String(val);
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-white font-bold text-xl">{title}</h2>
        <div className="flex items-center gap-2">
          <button onClick={onRefresh} className="btn-ghost" title="Actualizar">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={onNew} className="btn-primary">
            <Plus size={15} /> Nuevo
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-16">ID</th>
                {columns.map(col => (
                  <th key={col.key as string} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider w-24">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {loading ? (
                <tr><td colSpan={columns.length + 2} className="px-4 py-10 text-center text-gray-500">
                  <RefreshCw size={22} className="animate-spin mx-auto mb-2 text-navy-600" />
                  Cargando datos…
                </td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={columns.length + 2} className="px-4 py-10 text-center text-gray-500">
                  No hay registros. Crea el primero con el botón <strong>Nuevo</strong>.
                </td></tr>
              ) : data.map(row => (
                <tr key={row.t_id} className="table-row-hover">
                  <td className="px-4 py-3 font-mono text-navy-300 text-xs">{row.t_id}</td>
                  {columns.map(col => (
                    <td key={col.key as string} className="px-4 py-3 text-gray-300">
                      {getCellValue(row, col)}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => onEdit(row)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-navy-600/50 transition-all" title="Editar">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => onDelete(row)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-900/30 transition-all" title="Eliminar">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
          <span>Mostrando {data.length} registro{data.length !== 1 ? 's' : ''}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(Math.max(0, skip - limit))}
              disabled={skip === 0}
              className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="px-2">Pág. {Math.floor(skip / limit) + 1}</span>
            <button
              onClick={() => onPageChange(skip + limit)}
              disabled={data.length < limit}
              className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
