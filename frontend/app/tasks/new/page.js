'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import TaskForm from '../../../components/TaskForm';
import { isLoggedIn } from '../../../lib/auth';

export default function NewTaskPage() {
  const router = useRouter();
  useEffect(() => { if (!isLoggedIn()) router.push('/login'); }, []);

  return (
    <div className="min-h-screen bg-[var(--chalk)]">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-[var(--ink)] mb-1">New Task</h1>
          <p className="text-[var(--ink)] opacity-40 text-sm">
            Enter a title and use AI Generate to auto-fill details
          </p>
        </div>
        <TaskForm />
      </main>
    </div>
  );
}
