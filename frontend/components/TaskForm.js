"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Sparkles, Plus, X, Loader2 } from "lucide-react";
import api from "../lib/api";

export default function TaskForm({ initialData = {}, taskId = null }) {
  const router = useRouter();
  const isEditing = !!taskId;

  const [form, setForm] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    priority: initialData.priority || "medium",
    status: initialData.status || "todo",
    dueDate: initialData.dueDate ? initialData.dueDate.split("T")[0] : "",
    tags: initialData.tags || [],
    subtasks: initialData.subtasks || [],
  });

  const [tagInput, setTagInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── AI Generate ──────────────────────────────────────────────
  const handleAiGenerate = async () => {
    if (!form.title.trim() || form.title.length < 3) {
      toast.error("Enter a task title first (min 3 characters)");
      return;
    }
    setAiLoading(true);
    try {
      const { data } = await api.post("/ai/generate", {
        title: form.title,
        priority: form.priority,
      });
      setForm((prev) => ({
        ...prev,
        description: data.description,
        subtasks: data.subtasks,
      }));
      toast.success("AI suggestions applied!");
    } catch (err) {
      toast.error(err.response?.data?.message || "AI generation failed");
    } finally {
      setAiLoading(false);
    }
  };

  // ── Tags ──────────────────────────────────────────────────────
  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput("");
  };

  const removeTag = (tag) =>
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));

  // ── Subtasks ──────────────────────────────────────────────────
  const addSubtask = () =>
    setForm((prev) => ({
      ...prev,
      subtasks: [...prev.subtasks, { title: "", completed: false }],
    }));

  const updateSubtask = (i, value) => {
    const updated = [...form.subtasks];
    updated[i].title = value;
    setForm((prev) => ({ ...prev, subtasks: updated }));
  };

  const removeSubtask = (i) =>
    setForm((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, idx) => idx !== i),
    }));

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        subtasks: form.subtasks.filter((s) => s.title.trim()),
        aiGenerated: form.subtasks.some((s) => s.title) && !isEditing,
      };

      if (isEditing) {
        await api.put(`/tasks/${taskId}`, payload);
        toast.success("Task updated!");
      } else {
        await api.post("/tasks", payload);
        toast.success("Task created!");
      }
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Title + AI button */}
      <div>
        <label className="block text-sm font-medium text-[var(--ink)] mb-1.5">
          Task Title *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Set up CI/CD pipeline"
            className="flex-1 px-4 py-3 bg-white border border-[var(--border)] rounded-lg text-[var(--ink)] placeholder-gray-400 focus:outline-none focus:border-[var(--sage)] transition-colors"
          />
          <button
            type="button"
            onClick={handleAiGenerate}
            disabled={aiLoading}
            className="flex items-center gap-2 px-4 py-3 bg-[var(--ink)] text-[var(--chalk)] rounded-lg text-sm font-medium hover:bg-[var(--sage)] transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {aiLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            {aiLoading ? "Generating..." : "AI Generate"}
          </button>
        </div>
        <p className="text-xs text-[var(--ink)] opacity-40 mt-1.5">
          Click "AI Generate" to auto-fill description and subtasks using AI
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-[var(--ink)] mb-1.5">
          Description
        </label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Describe this task..."
          className="w-full px-4 py-3 bg-white border border-[var(--border)] rounded-lg text-[var(--ink)] placeholder-gray-400 focus:outline-none focus:border-[var(--sage)] transition-colors resize-none"
        />
      </div>

      {/* Priority + Status + Due Date */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--ink)] mb-1.5">
            Priority
          </label>
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-[var(--border)] rounded-lg text-[var(--ink)] focus:outline-none focus:border-[var(--sage)] transition-colors"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--ink)] mb-1.5">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-[var(--border)] rounded-lg text-[var(--ink)] focus:outline-none focus:border-[var(--sage)] transition-colors"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--ink)] mb-1.5">
            Due Date
          </label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-[var(--border)] rounded-lg text-[var(--ink)] focus:outline-none focus:border-[var(--sage)] transition-colors"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-[var(--ink)] mb-1.5">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addTag())
            }
            placeholder="Add a tag and press Enter"
            className="flex-1 px-4 py-2.5 bg-white border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder-gray-400 focus:outline-none focus:border-[var(--sage)] transition-colors"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-3 py-2.5 bg-[var(--mist)] border border-[var(--border)] rounded-lg hover:bg-[var(--ink)] hover:text-white transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-3 py-1 bg-[var(--mist)] rounded-full text-sm border border-[var(--border)]"
            >
              #{tag}
              <button type="button" onClick={() => removeTag(tag)}>
                <X size={12} className="opacity-50 hover:opacity-100" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Subtasks */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-[var(--ink)]">
            Subtasks
          </label>
          <button
            type="button"
            onClick={addSubtask}
            className="flex items-center gap-1 text-xs text-[var(--sage)] hover:underline"
          >
            <Plus size={13} /> Add subtask
          </button>
        </div>
        <div className="space-y-2">
          {form.subtasks.map((sub, i) => (
            <div key={i} className="flex gap-2 items-center">
              <span className="w-5 h-5 rounded border border-[var(--border)] bg-[var(--mist)] shrink-0" />
              <input
                type="text"
                value={sub.title}
                onChange={(e) => updateSubtask(i, e.target.value)}
                placeholder={`Subtask ${i + 1}`}
                className="flex-1 px-3 py-2 bg-white border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder-gray-400 focus:outline-none focus:border-[var(--sage)] transition-colors"
              />
              <button type="button" onClick={() => removeSubtask(i)}>
                <X
                  size={15}
                  className="text-[var(--rust)] opacity-50 hover:opacity-100"
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-3.5 bg-[var(--ink)] text-[var(--chalk)] rounded-lg font-medium hover:bg-[var(--sage)] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : isEditing ? "Update Task" : "Create Task"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="px-6 py-3.5 border border-[var(--border)] text-[var(--ink)] rounded-lg font-medium hover:bg-[var(--mist)] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
