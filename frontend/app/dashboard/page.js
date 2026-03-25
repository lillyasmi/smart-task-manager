"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Sparkles, Loader2, SlidersHorizontal } from "lucide-react";
import Navbar from "../../components/Navbar";
import TaskCard from "../../components/TaskCard";
import api from "../../lib/api";
import { getMe, isLoggedIn } from "../../lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
  });

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }
    const init = async () => {
      try {
        const u = await getMe();
        setUser(u);
        await fetchTasks();
      } catch {
        router.push("/login");
      }
    };
    init();
  }, []);

  const fetchTasks = useCallback(
    async (overrideFilters) => {
      setLoading(true);
      try {
        const params = overrideFilters || filters;
        const query = new URLSearchParams();
        if (params.status) query.set("status", params.status);
        if (params.priority) query.set("priority", params.priority);
        if (params.search) query.set("search", params.search);

        const { data } = await api.get(`/tasks?${query.toString()}`);
        setTasks(data.tasks);
      } catch {
        toast.error("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  const handleDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleAiSummary = async () => {
    if (tasks.length === 0) {
      toast.error("No tasks to summarize");
      return;
    }
    setSummaryLoading(true);
    try {
      const { data } = await api.post("/ai/summarize", { tasks });
      setAiSummary(data.summary);
    } catch {
      toast.error("AI summary failed");
    } finally {
      setSummaryLoading(false);
    }
  };

  const applyFilter = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    fetchTasks(updated);
  };

  // Stats
  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  return (
    <div className="min-h-screen bg-[var(--chalk)]">
      <Navbar user={user} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="font-display text-4xl font-bold text-[var(--ink)] mb-1">
              {user ? `${user.name.split(" ")[0]}'s Tasks` : "My Tasks"}
            </h1>
            <p className="text-[var(--ink)] opacity-40 text-sm">
              Manage and track everything in one place
            </p>
          </div>
          <button
            onClick={() => router.push("/tasks/new")}
            className="px-5 py-2.5 bg-[var(--ink)] text-[var(--chalk)] rounded-lg text-sm font-medium hover:bg-[var(--sage)] transition-colors"
          >
            + New Task
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: stats.total, color: "var(--ink)" },
            { label: "To Do", value: stats.todo, color: "#6B7280" },
            { label: "In Progress", value: stats.inProgress, color: "#3B82F6" },
            { label: "Done", value: stats.done, color: "var(--sage)" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-white border border-[var(--border)] rounded-xl p-5"
            >
              <p className="text-2xl font-display font-bold" style={{ color }}>
                {value}
              </p>
              <p className="text-xs text-[var(--ink)] opacity-50 mt-1">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* AI Summary */}
        <div className="border border-[var(--border)] bg-white rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[var(--sage)]" />
              <span className="text-sm font-medium text-[var(--ink)]">
                AI Productivity Summary
              </span>
            </div>
            <button
              onClick={handleAiSummary}
              disabled={summaryLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--ink)] text-[var(--chalk)] rounded-lg text-sm font-medium hover:bg-[var(--sage)] transition-colors"
            >
              {summaryLoading ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Sparkles size={12} />
              )}
              {summaryLoading ? "Analyzing..." : "Analyze my tasks"}
            </button>
          </div>
          {aiSummary ? (
            <p className="text-sm text-[var(--ink)] opacity-70 leading-relaxed">
              {aiSummary}
            </p>
          ) : (
            <p className="text-sm text-[var(--ink)] opacity-30 italic">
              Click "Analyze my tasks" to get a personalized AI productivity
              summary.
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-[var(--ink)] opacity-50">
            <SlidersHorizontal size={14} />
            Filters:
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => applyFilter("search", e.target.value)}
            className="px-3 py-2 bg-white border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--sage)] transition-colors"
          />
          <select
            value={filters.status}
            onChange={(e) => applyFilter("status", e.target.value)}
            className="px-3 py-2 bg-white border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--sage)] transition-colors"
          >
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => applyFilter("priority", e.target.value)}
            className="px-3 py-2 bg-white border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--sage)] transition-colors"
          >
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Task Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-[var(--sage)]" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📋</p>
            <p className="font-display text-xl text-[var(--ink)] opacity-40">
              No tasks yet
            </p>
            <p className="text-sm text-[var(--ink)] opacity-30 mt-1">
              Create your first task to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
