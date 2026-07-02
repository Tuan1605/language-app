import { useState, useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import type { FullExam, SessionTask, Question, ListeningLesson, SpeakingLesson, DictationLesson } from '../types';

interface CreateExamViewProps {
  onSave: (exam: FullExam) => void;
  onCancel: () => void;
  allQuestions: Question[];
  allListening: ListeningLesson[];
  allSpeaking: SpeakingLesson[];
  allDictation: DictationLesson[];
}

// Helper to get a display string for a task
const getTaskDescription = (task: SessionTask): string => {
  switch (task.type) {
    case 'quiz': return `Q: ${task.data.text}`;
    case 'listening': return `Listen: ${task.data.title}`;
    case 'speaking': return `Speak: ${task.data.targetSentence}`;
    case 'dictation': return `Dictation: ${task.data.targetText}`;
    case 'vocab-quiz': return `Vocab: ${task.data.word}`;
    default: return 'Unknown Task';
  }
}

export function CreateExamView({ onSave, onCancel, allQuestions, allListening, allSpeaking, allDictation }: CreateExamViewProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'toeic' | 'n2'>('toeic');
  const [tasks, setTasks] = useState<SessionTask[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSave = () => {
    if (title && tasks.length > 0) {
      const newExam: FullExam = {
        id: `custom-${crypto.randomUUID()}`,
        title,
        year: new Date().getFullYear(),
        category,
        tasks,
      };
      onSave(newExam);
    } else {
      alert('Please provide a title and at least one task.');
    }
  };

  const addTask = (task: SessionTask) => {
    setTasks([...tasks, task]);
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const isTaskAdded = (task: SessionTask): boolean => {
    return tasks.some(t => t.data.id === task.data.id && t.type === task.type);
  };
  
  const filteredQuestions = useMemo(() => allQuestions.filter(q => q.category === category && q.text.toLowerCase().includes(searchTerm.toLowerCase())), [allQuestions, category, searchTerm]);
  const filteredListening = useMemo(() => allListening.filter(l => l.category === category && l.title.toLowerCase().includes(searchTerm.toLowerCase())), [allListening, category, searchTerm]);
  const filteredSpeaking = useMemo(() => allSpeaking.filter(s => s.category === category && s.targetSentence.toLowerCase().includes(searchTerm.toLowerCase())), [allSpeaking, category, searchTerm]);
  const filteredDictation = useMemo(() => allDictation.filter(d => d.category === category && d.targetText.toLowerCase().includes(searchTerm.toLowerCase())), [allDictation, category, searchTerm]);


  return (
    <div className="w-full flex flex-col gap-6 p-2 md:p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black">Create Exam</h2>
        <button onClick={onCancel} className="text-2xl text-text-muted hover:text-text-main active:scale-90">✖</button>
      </div>
      
      {/* Exam Metadata */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="exam-title" className="font-bold text-sm text-text-muted">Exam Title</label>
          <input
            id="exam-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border-2 border-gray-path rounded-lg mt-1 bg-transparent"
            placeholder="e.g., My Awesome TOEIC Practice"
          />
        </div>
        <div className="flex-1 md:max-w-[180px]">
          <label htmlFor="exam-category" className="font-bold text-sm text-text-muted">Category</label>
          <select
            id="exam-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as 'toeic' | 'n2')}
            className="w-full p-3 border-2 border-gray-path rounded-lg mt-1 bg-transparent"
          >
            <option value="toeic">TOEIC</option>
            <option value="n2">JLPT N2</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        {/* Available Tasks Column */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-black">Available Tasks</h3>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border-2 border-gray-path rounded-lg bg-transparent"
            placeholder="🔍 Search tasks..."
          />
          <div className="max-h-[50vh] overflow-y-auto flex flex-col gap-2 pr-2">
            {/* Questions */}
            {filteredQuestions.map(q => {
              const task: SessionTask = { type: 'quiz', data: q };
              const added = isTaskAdded(task);
              return (
                <div key={`q-${q.id}`} className="flex items-center justify-between p-3 bg-gray-bg rounded-lg gap-2">
                  <p className="text-sm truncate" title={q.text}>{getTaskDescription(task)}</p>
                  <button onClick={() => addTask(task)} disabled={added} className={`btn-duo h-8 w-16 text-xs ${added ? 'btn-gray' : 'btn-blue'}`}>{added ? 'ADDED' : 'ADD'}</button>
                </div>
              );
            })}
            {/* Listening */}
            {filteredListening.map(l => {
              const task: SessionTask = { type: 'listening', data: l };
              const added = isTaskAdded(task);
              return (
                <div key={`l-${l.id}`} className="flex items-center justify-between p-3 bg-gray-bg rounded-lg gap-2">
                  <p className="text-sm truncate" title={l.title}>{getTaskDescription(task)}</p>
                  <button onClick={() => addTask(task)} disabled={added} className={`btn-duo h-8 w-16 text-xs ${added ? 'btn-gray' : 'btn-purple'}`}>{added ? 'ADDED' : 'ADD'}</button>
                </div>
              );
            })}
            {/* Speaking */}
            {filteredSpeaking.map(s => {
              const task: SessionTask = { type: 'speaking', data: s };
              const added = isTaskAdded(task);
              return (
                <div key={`s-${s.id}`} className="flex items-center justify-between p-3 bg-gray-bg rounded-lg gap-2">
                  <p className="text-sm truncate" title={s.targetSentence}>{getTaskDescription(task)}</p>
                  <button onClick={() => addTask(task)} disabled={added} className={`btn-duo h-8 w-16 text-xs ${added ? 'btn-gray' : 'btn-green'}`}>{added ? 'ADDED' : 'ADD'}</button>
                </div>
              );
            })}
            {/* Dictation */}
            {filteredDictation.map(d => {
              const task: SessionTask = { type: 'dictation', data: d };
              const added = isTaskAdded(task);
              return (
                <div key={`d-${d.id}`} className="flex items-center justify-between p-3 bg-gray-bg rounded-lg gap-2">
                  <p className="text-sm truncate" title={d.targetText}>{getTaskDescription(task)}</p>
                  <button onClick={() => addTask(task)} disabled={added} className={`btn-duo h-8 w-16 text-xs ${added ? 'btn-gray' : 'btn-red'}`}>{added ? 'ADDED' : 'ADD'}</button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Tasks Column */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-black">Selected Tasks ({tasks.length})</h3>
           <div className="max-h-[60vh] overflow-y-auto flex flex-col gap-2 pr-2 p-4 border-2 border-dashed border-gray-path rounded-xl">
             {tasks.length === 0 ? (
               <p className="text-center text-text-muted py-10">Add tasks from the left panel to build your exam.</p>
             ) : (
                tasks.map((task, index) => (
                  <div key={`${task.data.id}-${index}`} className="flex items-center justify-between p-3 bg-bg-main border-2 border-gray-path rounded-lg gap-2">
                    <p className="text-sm font-semibold truncate">{getTaskDescription(task)}</p>
                    <button onClick={() => removeTask(index)} className="text-red hover:text-red/80 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
             )}
           </div>
        </div>
      </div>

       <div className="flex justify-end items-center mt-6">
        <button onClick={handleSave} className="btn-duo btn-green h-14 w-full md:w-auto px-10">Save Custom Exam</button>
      </div>
    </div>
  );
}
