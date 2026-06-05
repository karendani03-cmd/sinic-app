import { useEffect, useState } from 'react';
import { checkHealth } from '../services/api';
import { Activity } from 'lucide-react';

export default function DBStatusIndicator() {
  const [status, setStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [msg, setMsg] = useState('');

  const check = async () => {
    try {
      const data = await checkHealth();
      setStatus(data.database.status === 'ok' ? 'ok' : 'error');
      setMsg(data.database.message);
    } catch {
      setStatus('error');
      setMsg('No se puede conectar al backend');
    }
  };

  useEffect(() => {
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  const colors = {
    checking: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    ok:       'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    error:    'text-red-400 bg-red-400/10 border-red-400/20',
  };
  const labels = { checking: 'Verificando...', ok: 'BD Conectada', error: 'BD Desconectada' };

  return (
    <div
      title={msg}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium cursor-default ${colors[status]}`}
    >
      <Activity size={11} className={status === 'checking' ? 'animate-pulse' : ''} />
      <span className="hidden sm:inline">{labels[status]}</span>
      <span
        className={`w-2 h-2 rounded-full ${
          status === 'ok' ? 'bg-emerald-400 animate-pulse' :
          status === 'error' ? 'bg-red-400' : 'bg-yellow-400 animate-pulse'
        }`}
      />
    </div>
  );
}
