import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, CheckCircle2, Circle, Tag, Sparkles } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  category: 'Work' | 'Health' | 'Personal' | 'Study';
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

const INITIAL_TASKS: Task[] = [
  { id: 1, title: 'Build Android Jetpack Compose app', category: 'Work', completed: true, priority: 'High' },
  { id: 2, title: 'Complete 30-min morning workout', category: 'Health', completed: true, priority: 'Medium' },
  { id: 3, title: 'Read Kotlin Coroutines documentation', category: 'Study', completed: false, priority: 'High' },
  { id: 4, title: 'Buy fresh espresso beans', category: 'Personal', completed: false, priority: 'Low' }
];

export const TaskApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'Work' | 'Health' | 'Personal' | 'Study'>('Work');

  const categories = ['All', 'Work', 'Health', 'Study', 'Personal'];

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      completed: false,
      priority: 'Medium'
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = selectedCategory === 'All' 
    ? tasks 
    : tasks.filter(t => t.category === selectedCategory);

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="h-full bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-y-auto pb-12">
      {/* Top Bar */}
      <div className="p-4 bg-slate-900/90 backdrop-blur sticky top-0 z-10 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-blue-300 leading-tight">FocusList</h1>
            <p className="text-[10px] text-slate-400">Room DB Local State</p>
          </div>
        </div>
        <span className="text-xs bg-blue-500/20 text-blue-300 font-bold px-2.5 py-1 rounded-full border border-blue-500/30">
          {completedCount}/{tasks.length} Done
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Progress Overview Card */}
        <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 p-4 rounded-3xl border border-blue-500/30 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-blue-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Daily Focus Goal
            </span>
            <span className="text-xs font-bold text-white">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl space-y-2">
          <input
            type="text"
            placeholder="Add new focus item..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Tag className="w-3.5 h-3.5" />
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2 py-1 text-xs focus:outline-none"
              >
                <option value="Work">Work</option>
                <option value="Health">Health</option>
                <option value="Study">Study</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow active:scale-95 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Task
            </button>
          </div>
        </form>

        {/* Task List */}
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">No tasks found in this category.</div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                  task.completed 
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-60' 
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="text-blue-400 focus:outline-none shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 hover:text-blue-400" />
                    )}
                  </button>
                  <div className="truncate">
                    <p className={`text-xs font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                      {task.title}
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono">{task.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
