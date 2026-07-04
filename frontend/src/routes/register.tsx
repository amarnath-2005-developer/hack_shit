import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import axios from "axios";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ClientOnly } from "@/components/ClientOnly";
import { ParticleField } from "@/components/landing/ParticleField";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — DisciplineOS" },
      { name: "description", content: "Create your DisciplineOS account and start your streak." },
    ],
  }),
  component: () => (
    <AuthProvider>
      <RegisterPage />
    </AuthProvider>
  ),
});

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
      await navigate({ to: "/dashboard" });
    } catch (err) {
      let msg = "Registration failed";
      if (axios.isAxiosError(err)) msg = err.response?.data?.message || err.message;
      else if (err instanceof Error) msg = err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#090909] text-foreground overflow-hidden flex items-center justify-center px-4 py-16">
      <ClientOnly>
        <ParticleField />
      </ClientOnly>
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-60" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-purple-accent/25 via-blue-accent/15 to-cyan-accent/20 blur-3xl animate-pulse-glow" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="relative w-7 h-7">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-accent to-cyan-accent" />
            <div className="absolute inset-[3px] rounded-md bg-background flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>
          <span className="font-semibold tracking-tight text-[15px]">DisciplineOS</span>
        </Link>

        <div className="glass-strong rounded-3xl p-8 shadow-[0_40px_120px_-30px_rgba(34,211,238,0.4)]">
          <h1 className="text-2xl font-semibold tracking-tight">Start your streak</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Free forever. No credit card. 60 seconds to first insight.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Name</span>
              <input
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                className="mt-1.5 input"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="mt-1.5 input"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Password
              </span>
              <div className="mt-1.5 relative">
                <input
                  type={show ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="input pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </label>

            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive px-3 py-2 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-5 py-3 text-sm font-medium hover:bg-white/90 transition disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Create account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-foreground hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>

      <style>{`
        .input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 11px 14px;
          font-size: 14px;
          color: white;
          outline: none;
          transition: border-color .15s, background .15s;
        }
        .input::placeholder { color: rgba(255,255,255,0.35); }
        .input:focus { border-color: rgba(34,211,238,0.6); background: rgba(255,255,255,0.06); }
      `}</style>
    </div>
  );
}
