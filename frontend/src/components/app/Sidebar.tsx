import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ListChecks,
  Target,
  LineChart,
  Sparkles,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/daily-logs", label: "Daily Logs", icon: ListChecks },
  { to: "/habits", label: "Habits", icon: Target },
  { to: "/analytics", label: "Analytics", icon: LineChart },
  { to: "/ai-coach", label: "AI Coach", icon: Sparkles },
] as const;

const secondary = [
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    void navigate({ to: "/login" });
  };

  const content = (
    <div className="flex flex-col h-full p-5">
      <Link to="/dashboard" className="flex items-center gap-3 px-2 py-2 mb-8 mt-2 group">
        <div className="relative w-8 h-8 flex-shrink-0">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 opacity-90 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-[1px] rounded-[7px] bg-background flex items-center justify-center backdrop-blur-md">
            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          </div>
        </div>
        <span className="font-semibold tracking-tight text-[15px] group-hover:text-white transition-colors text-foreground/90">
          DisciplineOS
        </span>
      </Link>

      <nav className="space-y-1.5 flex-1">
        {nav.map((n) => {
          const active = pathname === n.to || pathname.startsWith(n.to + "/");
          return (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => onOpenChange(false)}
              className={`group relative flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-300 ${
                active ? "text-white" : "text-muted-foreground hover:text-white"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="side-active"
                  className="absolute inset-0 rounded-xl bg-white/[0.04] border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              {!active && (
                <div className="absolute inset-0 rounded-xl bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
              <n.icon
                className={`relative w-4 h-4 transition-colors ${active ? "text-blue-400" : "group-hover:text-blue-300"}`}
                strokeWidth={active ? 2 : 1.75}
              />
              <span className="relative">{n.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1.5 pt-6 mt-6 border-t border-white/10">
        {secondary.map((n) => {
          const active = pathname === n.to;
          return (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => onOpenChange(false)}
              className={`group relative flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-300 ${
                active
                  ? "text-white bg-white/[0.04] border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              {!active && (
                <div className="absolute inset-0 rounded-xl bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
              <n.icon
                className={`relative w-4 h-4 transition-colors ${active ? "text-blue-400" : "group-hover:text-blue-300"}`}
                strokeWidth={active ? 2 : 1.75}
              />
              <span className="relative">{n.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3 px-3">
        <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 p-[1.5px]">
          <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-xs font-semibold text-white">
            {(user?.name || user?.email || "U").slice(0, 1).toUpperCase()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate text-foreground">
            {user?.name || "Guest"}
          </div>
          <div className="text-[11px] text-muted-foreground truncate">{user?.email || ""}</div>
        </div>
        <button
          onClick={handleLogout}
          title="Sign out"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => onOpenChange(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 glass-strong rounded-full flex items-center justify-center shadow-elevated border-white/10"
      >
        {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Desktop */}
      <aside className="hidden lg:block fixed top-4 bottom-4 left-4 w-72 z-40">
        <div className="glass-strong h-full rounded-[1.5rem] shadow-elevated border-white/10 bg-black/40 backdrop-blur-3xl">
          {content}
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onOpenChange(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed top-4 bottom-4 left-4 w-72 z-40"
            >
              <div className="glass-strong h-full rounded-[1.5rem] shadow-elevated border-white/10 bg-black/40 backdrop-blur-3xl">
                {content}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
