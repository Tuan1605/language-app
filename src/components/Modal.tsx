import type { ReactNode } from 'react';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  confirmText?: string;
  onConfirm?: () => void;
  cancelText?: string;
}

export function Modal({ isOpen, onClose, title, children, confirmText, onConfirm, cancelText = 'Cancel' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-[var(--bg-card)] rounded-[2rem] border-2 border-[var(--border-main)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <h2 className="text-2xl font-black text-[var(--text-main)] mb-4">{title}</h2>
          <div className="text-sm font-bold text-[var(--text-muted)] space-y-4">
            {children}
          </div>
        </div>
        
        <div className="p-6 bg-[var(--gray-bg)] border-t-2 border-[var(--gray-path)] flex items-center justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-2xl text-sm font-black text-[var(--text-muted)] hover:bg-[var(--gray-path)] transition-colors active:scale-95"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button 
              onClick={onConfirm}
              className="btn-duo btn-blue px-6 py-3 text-sm"
            >
              {confirmText || 'Confirm'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
