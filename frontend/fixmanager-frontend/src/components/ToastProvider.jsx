import { useEffect, useState } from 'react';
import { ToastContext } from './toastContext';

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const notify = (message, type = 'success') => setToast({ message, type });

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-xl" role="status">
          <span className={`h-2.5 w-2.5 rounded-full ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`} aria-hidden="true" />
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-slate-700" aria-label="Fermer la notification">×</button>
        </div>
      )}
    </ToastContext.Provider>
  );
}
