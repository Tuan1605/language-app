import { AnimatedPage } from '../components/AnimatedPage';
import { BookOpen, Mic, Headset, Edit3, Type } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';
import { useAppActions } from '../hooks/useAppActions';
import { useNavigate } from 'react-router-dom';

export function PracticePage() {
  const activeTrack = useUserStore(s => s.activeTrack);
  const { startDrill, trackCategory } = useAppActions();
  const navigate = useNavigate();

  const handleCreateExam = () => {
    navigate('/create-exam');
  };

  return (
    <AnimatedPage>
      <div className="w-full view-enter">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black text-gradient uppercase tracking-tight mb-3">Practice Arena</h2>
        <p className="text-sm font-bold text-text-muted">Hone your skills in specific areas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={() => startDrill('vocab-quiz')} className="lingo-card group hover:-translate-y-1 transition-all text-left flex items-start gap-4 p-6">
          <div className="w-12 h-12 rounded-xl bg-tint-blue text-blue flex items-center justify-center group-hover:scale-110 transition-transform">
            <BookOpen size={24} />
          </div>
          <div>
            <h3 className="font-black text-text-main mb-1">Vocabulary Quiz</h3>
            <p className="text-xs font-bold text-text-muted">Test your memory of saved words</p>
          </div>
        </button>

        <button onClick={() => startDrill('grammar')} className="lingo-card group hover:-translate-y-1 transition-all text-left flex items-start gap-4 p-6">
          <div className="w-12 h-12 rounded-xl bg-tint-purple text-purple flex items-center justify-center group-hover:scale-110 transition-transform">
            <Type size={24} />
          </div>
          <div>
            <h3 className="font-black text-text-main mb-1">Grammar Quiz</h3>
            <p className="text-xs font-bold text-text-muted">Practice sentence structures</p>
          </div>
        </button>

        <button onClick={() => startDrill('quiz')} className="lingo-card group hover:-translate-y-1 transition-all text-left flex items-start gap-4 p-6">
          <div className="w-12 h-12 rounded-xl bg-tint-gold text-gold flex items-center justify-center group-hover:scale-110 transition-transform">
            <Edit3 size={24} />
          </div>
          <div>
            <h3 className="font-black text-text-main mb-1">{trackCategory(activeTrack).toUpperCase()} Quiz</h3>
            <p className="text-xs font-bold text-text-muted">Format-specific questions</p>
          </div>
        </button>

        <button onClick={() => startDrill('listening')} className="lingo-card group hover:-translate-y-1 transition-all text-left flex items-start gap-4 p-6">
          <div className="w-12 h-12 rounded-xl bg-tint-green text-green flex items-center justify-center group-hover:scale-110 transition-transform">
            <Headset size={24} />
          </div>
          <div>
            <h3 className="font-black text-text-main mb-1">Listening</h3>
            <p className="text-xs font-bold text-text-muted">Train your ears</p>
          </div>
        </button>

        <button onClick={() => startDrill('speaking')} className="lingo-card group hover:-translate-y-1 transition-all text-left flex items-start gap-4 p-6">
          <div className="w-12 h-12 rounded-xl bg-tint-red text-red flex items-center justify-center group-hover:scale-110 transition-transform">
            <Mic size={24} />
          </div>
          <div>
            <h3 className="font-black text-text-main mb-1">Speaking</h3>
            <p className="text-xs font-bold text-text-muted">Practice pronunciation</p>
          </div>
        </button>

        <button onClick={() => startDrill('dictation')} className="lingo-card group hover:-translate-y-1 transition-all text-left flex items-start gap-4 p-6">
          <div className="w-12 h-12 rounded-xl bg-gray-path text-text-main flex items-center justify-center group-hover:scale-110 transition-transform">
            <Edit3 size={24} />
          </div>
          <div>
            <h3 className="font-black text-text-main mb-1">Dictation</h3>
            <p className="text-xs font-bold text-text-muted">Listen and write</p>
          </div>
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <h3 className="font-bold text-gray-700 text-lg">TOEIC 2024 PDF Exams (Study4 Style)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <button
              key={i}
              onClick={() => navigate(`/pdf-exam/toeic-2024-pdf-${i + 1}`)}
              className="btn-3d bg-blue-600 border-blue-700 text-white h-12 rounded-xl font-bold text-sm hover:bg-blue-500 transition-colors flex items-center justify-center"
            >
              Test {i + 1}
            </button>
          ))}
        </div>

        <button
          onClick={handleCreateExam}
          className="w-full btn-3d bg-gray-bg border-gray-path-dark text-text-main h-16 rounded-2xl font-black text-sm tracking-wide uppercase hover:bg-gray-path transition-colors flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Custom Exam
        </button>
      </div>
      </div>
    </AnimatedPage>
  );
}
