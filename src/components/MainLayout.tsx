import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';
import { useTransition, useState } from 'react';
import { OnboardingOverlay } from './OnboardingOverlay';
import { resetDatabase } from '../data/contentLoader';

const NAV_ITEMS = [
  {
    to: '/',
    end: true,
    label: 'LEARN',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    to: '/practice',
    label: 'PRACTICE',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M3 10v4M21 10v4M6 8h2v8H6zm10 0h2v8h-2z" />
      </svg>
    ),
  },
  {
    to: '/notebook',
    label: 'NOTEBOOK',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    to: '/review',
    label: 'REVIEW',
    showDueCount: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
  },
  {
    to: '/collection',
    label: 'LIBRARY',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
];

export function MainLayout() {
  const activeTrack = useUserStore(s => s.activeTrack);
  const setActiveTrack = useUserStore(s => s.setActiveTrack);
  const theme = useUserStore(s => s.theme);
  const toggleTheme = useUserStore(s => s.toggleTheme);
  const streak = useUserStore(s => s.streak);

  const [, startTransition] = useTransition();
  const location = useLocation();
  const [isResetting, setIsResetting] = useState(false);

  const handleResetData = async () => {
    if (!window.confirm('Reset all learning data and reload from source files?\nYour progress (SM-2 scores, mistakes, exam results) will be preserved.')) return;
    setIsResetting(true);
    try {
      await resetDatabase();
      window.location.reload();
    } catch (e) {
      console.error('Reset failed:', e);
      setIsResetting(false);
    }
  };

  // Due review count logic memoized to prevent O(N) recalculation on every render
  const dueCount = useLiveQuery(async () => {
    const today = new Date().getTime();
    return await db.cards
      .where('language').equals(activeTrack)
      .and(c => c.next_review != null && new Date(c.next_review).getTime() <= today)
      .count();
  }, [activeTrack]) || 0;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col md:flex-row font-sans selection:bg-[var(--blue)] selection:text-white transition-colors duration-300" data-track={activeTrack}>
      <OnboardingOverlay />
      
      {/* Duolingo-style Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r-2 border-[var(--gray-path)] p-6 fixed left-0 top-0 bottom-0 bg-[var(--bg-main)] z-50">
        <div className="mb-10 pl-2 flex items-center gap-3">
           <img src="/logo.png" alt="Lingomaster Logo" className="w-8 h-8 rounded-[8px] shadow-sm" />
           <h1 className="text-3xl font-black text-[var(--green)] tracking-tighter">lingo</h1>
        </div>
        
        <nav className="flex-1 space-y-2" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              end={item.end}
              aria-label={item.label} 
              className={({isActive}) => {
                const activeStyle = 'bg-[var(--tint-blue)] text-[var(--blue)] border-[var(--tint-blue)]';
                return `w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-xs tracking-wider transition-all border-2 active:scale-98 ${isActive ? activeStyle : 'border-transparent text-[var(--text-main)] hover:bg-[var(--gray-bg)]'}`;
              }}
            >
              {item.icon}
              {item.label}
              {item.showDueCount && dueCount > 0 && (
                <span className="ml-auto bg-[var(--gold)] text-white text-[10px] font-black rounded-full w-6 h-6 flex items-center justify-center">
                  {dueCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 w-full flex flex-col items-center min-h-screen lg:pl-64">
        
        {/* Top Header Bar */}
        {!(location.pathname === '/session' || location.pathname === '/real-exam' || location.pathname.startsWith('/pdf-exam')) && (
          <header className="w-full h-16 border-b-2 border-[var(--gray-path)] flex items-center justify-between px-6 sticky top-0 bg-[var(--bg-main)]/90 backdrop-blur-md z-40">
            <div className="flex items-center gap-6">
               <button onClick={() => startTransition(() => setActiveTrack('english'))} className={`font-black text-sm flex items-center gap-2 transition-all ${activeTrack === 'english' ? 'text-[var(--blue)] border-b-4 border-[var(--blue)] pb-1' : 'text-[var(--text-muted)] hover:text-[var(--gray-path-dark)]'}`}>
                 🇺🇸 EN
               </button>
               <button onClick={() => startTransition(() => setActiveTrack('japanese'))} className={`font-black text-sm flex items-center gap-2 transition-all ${activeTrack === 'japanese' ? 'text-[var(--blue)] border-b-4 border-[var(--blue)] pb-1' : 'text-[var(--text-muted)] hover:text-[var(--gray-path-dark)]'}`}>
                 🇯🇵 JP
               </button>
            </div>
            <div className="flex items-center gap-4 font-black">
               <span className="text-[var(--gold)] flex items-center gap-1" title={`Chuỗi học liên tục: ${streak} ngày`}>
                 <svg className="w-5 h-5 text-[var(--gold)]" fill="currentColor" viewBox="0 0 24 24"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 8.25 3c.89 0 1.765.176 2.58.5a7.126 7.126 0 00.995-1.077c.4-.492.793-1.066 1.054-1.63A1.125 1.125 0 0114.996 1a14.766 14.766 0 012.392 7.75c0 2.457-.655 4.757-1.785 6.643-1.258 2.096-2.923 3.51-3.958 4.228z"/></svg>
                 {streak}
               </span>
               <button onClick={toggleTheme} className="text-xl active:scale-95 transition-transform">{theme === 'light' ? '🌙' : '☀️'}</button>
               <button
                 onClick={handleResetData}
                 disabled={isResetting}
                 className="text-xs text-[var(--text-muted)] hover:text-[var(--red)] transition-colors active:scale-95"
                 title="Reset & reload content data"
               >
                 {isResetting ? '⏳' : '🔄'}
               </button>
            </div>
          </header>
        )}

        <div className={`w-full flex flex-col ${location.pathname.startsWith('/pdf-exam') ? 'flex-1 h-full' : 'items-center max-w-[600px] p-6 md:p-10 pb-28 lg:pb-40'}`}>
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {!(location.pathname === '/session' || location.pathname === '/real-exam' || location.pathname.startsWith('/pdf-exam')) && (
        <nav className="flex lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[var(--bg-main)]/95 backdrop-blur-md border-t-2 border-[var(--gray-path)] z-50 px-2 pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center justify-around w-full h-full">
            {NAV_ITEMS.filter(item => ['/', '/practice', '/review', '/collection', '/analytics'].includes(item.to)).map((item) => (
              <NavLink 
                key={item.to} 
                to={item.to} 
                end={item.end}
                aria-label={item.label} 
                className={({isActive}) => {
                  const activeStyle = 'text-[var(--blue)]';
                  return `flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${isActive ? activeStyle : 'text-[var(--gray-path-dark)] hover:text-[var(--text-main)]'}`;
                }}
              >
                <div className="relative">
                  {item.icon}
                  {item.showDueCount && dueCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-[var(--gold)] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
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
