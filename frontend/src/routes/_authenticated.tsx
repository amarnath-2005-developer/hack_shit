import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/_authenticated")({
  component: () => (
    <AuthProvider>
      <Guard>
        <AppShell>
          <Outlet />
        </AppShell>
      </Guard>
    </AuthProvider>
  ),
});

function Guard({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !token) {
      void navigate({ to: "/login" });
    }
  }, [loading, token, navigate]);

  if (loading || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090909]">
        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-purple-accent animate-spin" />
      </div>
    );
  }
  return <>{children}</>;
}
