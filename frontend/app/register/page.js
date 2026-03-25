'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { register } from '../../lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome aboard.');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--sage)] flex-col justify-between p-16">
        <span className="text-white font-display text-2xl font-semibold">TaskFlow</span>
        <div>
          <p className="text-white text-5xl font-display leading-tight mb-6">
            Your tasks,<br />
            <span className="text-[var(--gold)]">AI enhanced.</span>
          </p>
          <p className="text-white text-lg font-light opacity-80">
            Let AI generate descriptions and subtasks instantly.
          </p>
        </div>
        <p className="text-white text-sm opacity-40">© 2025 TaskFlow</p>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[var(--chalk)]">
        <div className="w-full max-w-md animate-slide-up">
          <h1 className="text-4xl font-display font-bold text-[var(--ink)] mb-2">Create account</h1>
          <p className="text-[var(--ink)] opacity-50 mb-10 font-body">
            Already have an account?{' '}
            <Link href="/login" className="text-[var(--sage)] underline underline-offset-4">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--ink)] mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Doe"
                className="w-full px-4 py-3 bg-white border border-[var(--border)] rounded-lg text-[var(--ink)] placeholder-gray-400 focus:outline-none focus:border-[var(--sage)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--ink)] mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white border border-[var(--border)] rounded-lg text-[var(--ink)] placeholder-gray-400 focus:outline-none focus:border-[var(--sage)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--ink)] mb-1.5">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 characters"
                className="w-full px-4 py-3 bg-white border border-[var(--border)] rounded-lg text-[var(--ink)] placeholder-gray-400 focus:outline-none focus:border-[var(--sage)] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[var(--ink)] text-[var(--chalk)] rounded-lg font-medium text-sm hover:bg-[var(--sage)] transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
