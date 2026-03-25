"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import Navbar from "../../../../components/Navbar";
import TaskForm from "../../../../components/TaskForm";
import api from "../../../../lib/api";
import { isLoggedIn } from "../../../../lib/auth";

export default function EditTaskPage() {
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

  if (loading)
    return (
      <div className="min-h-screen bg-[var(--chalk)]">
        <Navbar />
        <div className="flex justify-center py-20 text-[var(--ink)] opacity-40">
          Loading...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--chalk)]">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <Link
          href={`/tasks/${id}`}
          className="flex items-center gap-1.5 text-sm text-[var(--ink)] opacity-40 hover:opacity-100 transition-opacity mb-8"
        >
          <ArrowLeft size={14} /> Back to task
        </Link>
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-[var(--ink)] mb-1">
            Edit Task
          </h1>
          <p className="text-[var(--ink)] opacity-40 text-sm">
            Update the details below
          </p>
        </div>
        {task && <TaskForm initialData={task} taskId={id} />}
      </main>
    </div>
  );
}
