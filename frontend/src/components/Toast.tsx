import { useState, createContext, useContext, useCallback } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastCtx {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastCtx>({ showToast: () => {} });
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  const icons = { success: CheckCircle2, error: XCircle, info: Info };
  const styles = {
    success: 'bg-emerald-900/90 border-emerald-600/50 text-emerald-100',
    error:   'bg-red-900/90 border-red-600/50 text-red-100',
    info:    'bg-navy-800/90 border-navy-600/50 text-blue-100',
  };
  const iconColors = { success: 'text-emerald-400', error: 'text-red-400', info: 'text-blue-400' };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(t => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              className={`animate-toast-in flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-xl pointer-events-auto ${styles[t.type]}`}
            >
              <Icon size={18} className={`shrink-0 mt-0.5 ${iconColors[t.type]}`} />
              <p className="text-sm flex-1 leading-snug">{t.message}</p>
              <button onClick={() => dismiss(t.id)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
