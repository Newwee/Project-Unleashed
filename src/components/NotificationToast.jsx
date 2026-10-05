import React from 'react';
import { useStudio } from '../context/StudioContext';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

export default function NotificationToast() {
  const { toastMessage } = useStudio();

  if (!toastMessage) return null;

  const { message, type } = toastMessage;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] border backdrop-blur-xl ${
          type === 'error'
            ? 'bg-red-950/90 border-red-500/50 text-red-200'
            : type === 'info'
            ? 'bg-blue-950/90 border-blue-500/50 text-blue-200'
            : 'bg-[#0c162d]/95 border-sky-500/50 text-sky-200'
        }`}
      >
        {type === 'error' ? (
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
        ) : type === 'info' ? (
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        ) : (
          <CheckCircle className="w-4 h-4 text-sky-400 flex-shrink-0" />
        )}
        <span className="text-xs font-mono font-medium">{message}</span>
      </div>
    </div>
  );
}
