import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) cancelRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onCancel}
    >
      <div
        className="bg-bg-card rounded-2xl w-full max-w-sm p-6 shadow-2xl border-2 border-gray-path animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${danger ? 'bg-tint-red' : 'bg-tint-gold'}`}>
            <AlertTriangle className={`w-5 h-5 ${danger ? 'text-red' : 'text-gold'}`} />
          </div>
          <h3 id="confirm-title" className="font-black text-lg text-text-main">{title}</h3>
        </div>
        <p id="confirm-message" className="text-sm font-bold text-text-muted mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl font-black text-text-muted hover:bg-bg-hover transition-colors text-sm border-2 border-border-main"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl font-black text-white text-sm transition-all ${
              danger
                ? 'bg-red hover:bg-[#dc2626] shadow-[0_4px_0_#991b1b]'
                : 'bg-blue hover:bg-[#2563eb] shadow-[0_4px_0_#1d4ed8]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
