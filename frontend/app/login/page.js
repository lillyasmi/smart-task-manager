"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { login } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--ink)] flex-col justify-between p-16">
        <div>
          <span className="text-[var(--chalk)] font-display text-2xl font-semibold tracking-tight">
            TaskFlow
          </span>
        </div>
        <div>
          <p className="text-[var(--border)] text-5xl font-display leading-tight mb-6">
            Work smarter,
            <br />
            <span className="text-[var(--gold)]">not harder.</span>
          </p>
          <p className="text-[var(--border)] text-lg font-light opacity-70">
            AI-powered tasks that plan themselves.
          </p>
        </div>
        <p className="text-[var(--border)] text-sm opacity-40">
          © {new Date().getFullYear()} TaskFlow
        </p>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[var(--chalk)]">
        <div className="w-full max-w-md animate-slide-up">
          <h1 className="text-4xl font-display font-bold text-[var(--ink)] mb-2">
            Sign in
          </h1>
          <p className="text-[var(--ink)] opacity-50 mb-10 font-body">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-[var(--sage)] underline underline-offset-4"
            >
              Register
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--ink)] mb-1.5">
                Email
              </label>
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
              <label className="block text-sm font-medium text-[var(--ink)] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white border border-[var(--border)] rounded-lg text-[var(--ink)] placeholder-gray-400 focus:outline-none focus:border-[var(--sage)] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[var(--ink)] text-[var(--chalk)] rounded-lg font-medium text-sm hover:bg-[var(--sage)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
