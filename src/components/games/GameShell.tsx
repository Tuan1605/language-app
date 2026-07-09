import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

interface GameShellProps {
  title: string;
  icon?: ReactNode;
  onBack: () => void;
  difficulty?: string;
  children: ReactNode;
}

export function GameShell({ title, icon, onBack, difficulty, children }: GameShellProps) {
  return (
    <div className="flex-1 flex flex-col w-full h-full">
      {/* Game Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-gray-bg border-2 border-gray-path hover:border-blue hover:bg-blue/5 transition-all text-text-muted hover:text-blue"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            {icon && <span className="text-blue">{icon}</span>}
            <h2 className="text-lg font-black text-text-main">{title}</h2>
          </div>
        </div>
        {difficulty && (
          <span className="px-3 py-1 bg-gray-bg border-2 border-gray-path rounded-full text-xs font-black uppercase tracking-wider text-text-muted">
            {difficulty}
          </span>
        )}
      </div>

      {/* Game Content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
