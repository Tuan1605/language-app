import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Moon, Sun, BookOpen, Dumbbell, NotebookPen, RotateCcw, Library, Download, Upload, Settings, Layers, Gamepad2 } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';
import { useTransition, useState, useRef } from 'react';
import { useAppActions } from '../hooks/useAppActions';
import { SettingsModal } from './SettingsModal';

const NAV_ITEMS = [
  { to: '/', end: true, label: 'LEARN', icon: <BookOpen className="w-5 h-5" /> },
  { to: '/flashcard', label: 'FLASHCARD', icon: <Layers className="w-5 h-5" /> },
  { to: '/practice', label: 'PRACTICE', icon: <Dumbbell className="w-5 h-5" /> },
  { to: '/notebook', label: 'NOTEBOOK', icon: <NotebookPen className="w-5 h-5" /> },
  { to: '/review', label: 'REVIEW', showDueCount: true, icon: <RotateCcw className="w-5 h-5" /> },
  { to: '/games', label: 'GAMES', icon: <Gamepad2 className="w-5 h-5" /> },
  { to: '/collection', label: 'LIBRARY', icon: <Library className="w-5 h-5" /> },
];

export function MainLayout() {
  const activeTrack = useUserStore(s => s.activeTrack);
  const setActiveTrack = useUserStore(s => s.setActiveTrack);
  const theme = useUserStore(s => s.theme);
  const toggleTheme = useUserStore(s => s.toggleTheme);

  const [, startTransition] = useTransition();
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);
  const importFileRef = useRef<HTMLInputElement>(null);

  const { exportUserData, importUserData } = useAppActions();

  // Due review count logic memoized to prevent O(N) recalculation on every render
  const dueCount = useLiveQuery(async () => {
    const today = new Date().getTime();
    return await db.cards
      .where('language').equals(activeTrack)
      .and(c => c.next_review != null && new Date(c.next_review).getTime() <= today)
      .count();
  }, [activeTrack]) || 0;

  return (
    <div className="min-h-screen bg-bg-main text-text-main flex flex-col md:flex-row font-sans selection:bg-blue selection:text-white transition-colors duration-300" data-track={activeTrack}>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      
      {/* Duolingo-style Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r-2 border-gray-path p-6 fixed left-0 top-0 bottom-0 bg-bg-main z-50">
        <div className="mb-10 pl-2 flex items-center gap-3">
           <img src="/logo.png" alt="Lingomaster Logo" className="w-8 h-8 rounded-[8px] shadow-sm" />
           <h1 className="text-3xl font-black text-green tracking-tighter">lingo</h1>
        </div>
        
        <nav className="flex-1 space-y-2" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              end={item.end}
              aria-label={item.label} 
              className={({isActive}) => {
                const activeStyle = 'bg-tint-blue text-blue border-tint-blue';
                return `w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-xs tracking-wider transition-all border-2 active:scale-98 ${isActive ? activeStyle : 'border-transparent text-text-main hover:bg-gray-bg'}`;
              }}
            >
              {item.icon}
              {item.label}
              {item.showDueCount && dueCount > 0 && (
                <span className="ml-auto bg-gold text-white text-[10px] font-black rounded-full w-6 h-6 flex items-center justify-center">
                  {dueCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 w-full flex flex-col items-center min-h-screen lg:pl-64">
        
        {/* Top Header Bar */}
        {!(location.pathname === '/session' || location.pathname === '/real-exam') && (
          <header className="w-full h-16 border-b-2 border-gray-path flex items-center justify-between px-6 sticky top-0 bg-[var(--bg-main)] shadow-[var(--shadow-outset)] z-40">
            <div className="flex items-center gap-6">
               <button onClick={() => startTransition(() => setActiveTrack('english'))} className={`font-black text-sm flex items-center gap-2 transition-all ${activeTrack === 'english' ? 'text-blue border-b-4 border-blue pb-1' : 'text-text-muted hover:text-gray-path-dark'}`}>
                 🇺🇸 EN
               </button>
               <button onClick={() => startTransition(() => setActiveTrack('japanese'))} className={`font-black text-sm flex items-center gap-2 transition-all ${activeTrack === 'japanese' ? 'text-blue border-b-4 border-blue pb-1' : 'text-text-muted hover:text-gray-path-dark'}`}>
                 🇯🇵 JP
               </button>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-4 font-black">

               {/* Backup Buttons */}
               <button
                 onClick={exportUserData}
                 className="text-text-muted hover:text-green transition-colors active:scale-95"
                 title="Export backup"
               >
                 <Download className="w-4 h-4" />
               </button>
               <button
                 onClick={() => importFileRef.current?.click()}
                 className="text-text-muted hover:text-blue transition-colors active:scale-95"
                 title="Import backup"
               >
                 <Upload className="w-4 h-4" />
               </button>
               <input
                 ref={importFileRef}
                 type="file"
                 accept=".json"
                 className="hidden"
                 onChange={(e) => {
                   const file = e.target.files?.[0];
                   if (file) {
                     importUserData(file);
                     e.target.value = '';
                   }
                 }}
               />

               <button onClick={toggleTheme} className="text-xl active:scale-95 transition-transform hover:text-blue">
                 {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
               </button>
                <button
                 onClick={() => setShowSettings(true)}
                 className="text-xs text-text-muted hover:text-purple transition-colors active:scale-95"
                 title="AI Settings"
               >
                 <Settings className="w-5 h-5" />
               </button>
            </div>
            </div>
          </header>
        )}

        <div className={`w-full flex flex-col items-center p-6 md:p-10 pb-28 lg:pb-40 ${location.pathname === '/review' ? 'max-w-[800px] lg:max-w-[960px]' : 'max-w-[600px] lg:max-w-[720px]'}`}>
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {!(location.pathname === '/session' || location.pathname === '/real-exam') && (
        <nav className="flex lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-bg-main/95 backdrop-blur-md border-t-2 border-gray-path z-50 px-2 pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center justify-around w-full h-full">
            {NAV_ITEMS.filter(item => ['/', '/flashcard', '/practice', '/games', '/review'].includes(item.to)).map((item) => (
              <NavLink 
                key={item.to} 
                to={item.to} 
                end={item.end}
                aria-label={item.label} 
                className={({isActive}) => {
                  const activeStyle = 'text-blue';
                  return `flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${isActive ? activeStyle : 'text-gray-path-dark hover:text-text-main'}`;
                }}
              >
                <div className="relative">
                  {item.icon}
                  {item.showDueCount && dueCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-gold text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                      {dueCount > 99 ? '99+' : dueCount}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-bold">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
