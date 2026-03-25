'use client';
import Link from 'next/link';
import { format } from 'date-fns';
import { Trash2, Pencil, CalendarDays, Sparkles } from 'lucide-react';

const priorityStyles = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const statusStyles = {
  todo: 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-blue-100 text-blue-700',
  done: 'bg-[#e8f5e9] text-[var(--sage)]',
};

export default function TaskCard({ task, onDelete }) {
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-5 hover:shadow-md transition-shadow animate-fade-in group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <Link href={`/tasks/${task._id}`} className="group/link">
          <h3 className="font-display font-semibold text-[var(--ink)] text-lg leading-snug group-hover/link:text-[var(--sage)] transition-colors">
            {task.title}
          </h3>
        </Link>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Link href={`/tasks/${task._id}/edit`}>
            <Pencil size={15} className="text-[var(--ink)] opacity-50 hover:opacity-100 cursor-pointer" />
          </Link>
          <button onClick={() => onDelete(task._id)}>
            <Trash2 size={15} className="text-[var(--rust)] opacity-50 hover:opacity-100" />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-[var(--ink)] opacity-60 mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[task.status]}`}>
          {task.status}
        </span>
        {task.aiGenerated && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 flex items-center gap-1">
            <Sparkles size={10} /> AI
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-[var(--ink)] opacity-40">
        <div className="flex items-center gap-1">
          {task.dueDate && (
            <>
              <CalendarDays size={12} />
              <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
            </>
          )}
        </div>
        {totalSubtasks > 0 && (
          <span>{completedSubtasks}/{totalSubtasks} subtasks</span>
        )}
      </div>

      {/* Subtask progress bar */}
      {totalSubtasks > 0 && (
        <div className="mt-3 h-1 bg-[var(--mist)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--sage)] rounded-full transition-all"
            style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
