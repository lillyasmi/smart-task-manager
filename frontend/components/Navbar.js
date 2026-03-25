"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, PlusCircle } from "lucide-react";
import { logout } from "../lib/auth";

export default function Navbar({ user }) {
  const pathname = usePathname();

  return (
    <nav className="bg-[var(--ink)] text-[var(--chalk)] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link
        href="/dashboard"
        className="font-display text-xl font-semibold tracking-tight"
      >
        TaskFlow
      </Link>

      <div className="flex items-center gap-6">
        <Link
          href="/dashboard"
          className={`flex items-center gap-1.5 text-sm transition-opacity ${
            pathname === "/dashboard"
              ? "opacity-100"
              : "opacity-50 hover:opacity-100"
          }`}
        >
          <LayoutDashboard size={15} />
          Dashboard
        </Link>

        <Link
          href="/tasks/new"
          className={`flex items-center gap-1.5 text-sm transition-opacity ${
            pathname === "/tasks/new"
              ? "opacity-100"
              : "opacity-50 hover:opacity-100"
          }`}
        >
          <PlusCircle size={15} />
          New Task
        </Link>

        {user && (
          <span className="text-sm opacity-40 hidden sm:block">
            Hi, {user.name.split(" ")[0]}
          </span>
        )}

        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-sm opacity-50 hover:opacity-100 transition-opacity"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </nav>
  );
}
