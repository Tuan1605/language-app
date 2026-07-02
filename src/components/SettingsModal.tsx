import { useState } from 'react';
import { useUserStore } from '../stores/useUserStore';
import { X, Key, Bot } from 'lucide-react';
import { maskApiKey } from '../utils/sanitize';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { openAIApiKey, setOpenAIApiKey } = useUserStore();
  const [apiKey, setApiKey] = useState(openAIApiKey || '');

  const handleSave = () => {
    setOpenAIApiKey(apiKey.trim() || null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 backdrop-blur-sm">
      <div className="bg-bg-card lingo-card p-6 w-full max-w-md animate-in zoom-in-95 duration-300 relative border-2 border-border-main shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors"
        >
          <X size={24} strokeWidth={2.5} />
        </button>

        <div className="mb-6">
          <div className="w-12 h-12 bg-tint-purple text-purple rounded-2xl flex items-center justify-center mb-4 border-2 border-purple shadow-[var(--shadow-outset)]">
            <Bot size={28} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-black mb-1">AI Grading Settings</h2>
          <p className="text-sm font-bold text-text-muted">
            Connect your OpenAI API key to enable pro-level speaking and grammar grading via Whisper and GPT-4o-mini.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-xs font-black uppercase text-text-muted mb-2 tracking-widest flex items-center gap-2">
              <Key size={14} /> OpenAI API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full h-12 px-4 rounded-xl border-2 border-border-main bg-bg-main text-text-main font-medium focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20 transition-all placeholder:text-text-muted/50"
            />
            {openAIApiKey && (
              <p className="text-[10px] font-bold text-text-muted mt-1">
                Current: {maskApiKey(openAIApiKey)}
              </p>
            )}
          </div>
          <p className="text-[10px] font-bold text-text-muted italic bg-bg-hover p-3 rounded-lg border border-border-main">
            Your key is stored locally in your browser and is never sent to our servers (because we don't have one). It is sent directly to OpenAI.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-black text-text-muted hover:bg-bg-hover transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl font-black btn-3d btn-purple text-sm flex items-center justify-center gap-2"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
