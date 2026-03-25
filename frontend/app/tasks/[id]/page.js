"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  Pencil,
  Trash2,
  ArrowLeft,
  CalendarDays,
  Sparkles,
  Tag,
} from "lucide-react";
import Navbar from "../../../components/Navbar";
import api from "../../../lib/api";
import { isLoggedIn } from "../../../lib/auth";

const priorityStyles = {
  high: "bg-red-100 text-red-700 border border-red-200",
  medium: "bg-amber-100 text-amber-700 border border-amber-200",
  low: "bg-emerald-100 text-emerald-700 border border-emerald-200",
};

export default function TaskDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }
    const fetch = async () => {
      try {
        const { data } = await api.get(`/tasks/${id}`);
        setTask(data.task);
      } catch {
        toast.error("Task not found");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const toggleSubtask = async (subtaskId) => {
    try {
      const { data } = await api.patch(`/tasks/${id}/subtasks/${subtaskId}`);
      setTask(data.task);
    } catch {
      toast.error("Failed to update subtask");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[var(--chalk)]">
        <Navbar />
        <div className="flex justify-center py-20 text-[var(--ink)] opacity-40">
          Loading...
        </div>
      </div>
    );

  if (!task) return null;

  const completedSubtasks =
    task.subtasks?.filter((s) => s.completed).length || 0;

  return (
    <div className="min-h-screen bg-[var(--chalk)]">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-10 animate-slide-up">
        {/* Back */}
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-[var(--ink)] opacity-40 hover:opacity-100 transition-opacity mb-8"
        >
          <ArrowLeft size={14} /> Back to dashboard
        </Link>

        {/* Header */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-8 mb-4">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${priorityStyles[task.priority]}`}
                >
                  {task.priority} priority
                </span>
                {task.aiGenerated && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 flex items-center gap-1">
                    <Sparkles size={10} /> AI-generated
                  </span>
                )}
              </div>
              <h1 className="font-display text-3xl font-bold text-[var(--ink)] leading-tight">
                {task.title}
              </h1>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/tasks/${id}/edit`}
                className="p-2 hover:bg-[var(--mist)] rounded-lg transition-colors"
              >
                <Pencil size={16} className="text-[var(--ink)] opacity-60" />
              </Link>
              <button
                onClick={handleDelete}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} className="text-[var(--rust)]" />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-[var(--ink)] opacity-70 leading-relaxed mb-6">
              {task.description}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-[var(--ink)] opacity-50">
            <span className="capitalize">
              Status: <strong className="opacity-100">{task.status}</strong>
            </span>
            {task.dueDate && (
              <span className="flex items-center gap-1">
                <CalendarDays size={13} />
                Due:{" "}
                <strong className="opacity-100">
                  {format(new Date(task.dueDate), "MMM d, yyyy")}
                </strong>
              </span>
            )}
            <span>
              Created: {format(new Date(task.createdAt), "MMM d, yyyy")}
            </span>
          </div>

          {/* Tags */}
          {task.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 bg-[var(--mist)] rounded-full text-xs border border-[var(--border)]"
                >
                  <Tag size={10} />#{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Subtasks */}
        {task.subtasks?.length > 0 && (
          <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg text-[var(--ink)]">
                Subtasks
              </h2>
              <span className="text-xs text-[var(--ink)] opacity-40">
                {completedSubtasks}/{task.subtasks.length} done
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-[var(--mist)] rounded-full mb-5 overflow-hidden">
              <div
                className="h-full bg-[var(--sage)] rounded-full transition-all"
                style={{
                  width: `${(completedSubtasks / task.subtasks.length) * 100}%`,
                }}
              />
            </div>

            <div className="space-y-3">
              {task.subtasks.map((sub) => (
                <div
                  key={sub._id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-[var(--mist)] transition-colors ${sub.completed ? "opacity-50" : ""}`}
                  onClick={() => toggleSubtask(sub._id)}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${sub.completed ? "bg-[var(--sage)] border-[var(--sage)]" : "border-[var(--border)]"}`}
                  >
                    {sub.completed && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </div>
                  <span
                    className={`text-sm ${sub.completed ? "line-through text-[var(--ink)]" : "text-[var(--ink)]"}`}
                  >
                    {sub.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
