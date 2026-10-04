import React from 'react';
import { ToastNotification } from '../types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-slate-900 text-white rounded-xl p-3.5 shadow-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs animate-in slide-in-from-bottom-2 fade-in duration-200"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {toast.type === 'success' && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            {toast.type === 'info' && (
              <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className="font-semibold text-slate-100 truncate">{toast.title}</p>
              {toast.message && (
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">{toast.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {toast.undoAction && (
              <button
                onClick={() => {
                  toast.undoAction!();
                  onDismiss(toast.id);
                }}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-300 font-bold text-[11px] transition-colors"
              >
                {toast.undoLabel || 'Undo'}
              </button>
            )}
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
