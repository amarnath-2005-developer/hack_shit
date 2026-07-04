import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { ClientOnly } from "@/components/ClientOnly";
import { HeroScene } from "./HeroScene";

export function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 100, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 100, damping: 20 });
  const tx = useSpring(useTransform(mx, [-0.5, 0.5], [-20, 20]), { stiffness: 100, damping: 20 });
  const ty = useSpring(useTransform(my, [-0.5, 0.5], [-20, 20]), { stiffness: 100, damping: 20 });

  return (
    <section
      id="top"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      className="relative pt-40 pb-32 md:pt-48 md:pb-40 overflow-hidden min-h-[100svh]"
    >
      {/* Premium subtle grid backdrop */}
      <div className="pointer-events-none absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      {/* Central light beam */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[500px] bg-gradient-to-b from-blue-500/20 to-transparent blur-3xl opacity-50" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-[13px] font-medium text-foreground mb-8 border-white/10 shadow-glass"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>DisciplineOS v2 is here</span>
          <div className="w-[1px] h-3 bg-white/20 mx-1" />
          <span className="text-muted-foreground flex items-center gap-1 group cursor-pointer hover:text-white transition-colors">
            Read the launch notes{" "}
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[96px] font-medium tracking-tight leading-[1.05]"
        >
          Master your discipline.
          <br />
          <span className="text-gradient">Transform your future.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed font-light tracking-wide"
        >
          The AI-powered operating system for building consistency, habits, and long-term success —
          designed for humans who ship.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#cta"
            className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-8 py-3.5 text-[15px] font-medium hover:bg-white/90 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:scale-105 hover:shadow-[0_0_60px_rgba(255,255,255,0.25)]"
          >
            Start building
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href="#ai"
            className="inline-flex items-center justify-center gap-2 glass rounded-full px-8 py-3.5 text-[15px] font-medium hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            <Play className="w-4 h-4 text-white" fill="currentColor" />
            Watch demo
          </a>
        </motion.div>

        {/* 3D scene + floating dashboard mock */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ perspective: 2500 }}
          className="relative mt-24 mx-auto max-w-5xl"
        >
          <motion.div
            style={{ rotateX: rx, rotateY: ry, x: tx, y: ty, transformStyle: "preserve-3d" }}
            className="relative"
          >
            {/* 3D scene backdrop (The premium sphere) */}
            <div className="absolute -inset-32 -z-10 opacity-100">
              <ClientOnly>
                <HeroScene />
              </ClientOnly>
            </div>

            <div className="glass-strong rounded-2xl overflow-hidden shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] border border-white/10 backdrop-blur-3xl bg-black/40" style={{ transformStyle: "preserve-3d" }}>
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ED6A5E]" />
                  <div className="w-3 h-3 rounded-full bg-[#F4BF4F]" />
                  <div className="w-3 h-3 rounded-full bg-[#61C554]" />
                </div>
                <div className="text-xs text-muted-foreground font-mono opacity-60">
                  disciplineos.app / dashboard
                </div>
                <div className="w-12" /> {/* Spacer for centering */}
              </div>
              <div className="grid grid-cols-6 gap-6 p-8 bg-gradient-to-br from-white/[0.02] to-transparent">
                {/* Discipline ring */}
                <div className="col-span-2 glass rounded-xl p-6 flex flex-col items-center justify-center aspect-square shadow-elevated border-white/5 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] transition-all duration-500" style={{ transform: "translateZ(30px)" }}>
                  <RingChart value={87} />
                  <div className="mt-4 text-sm text-muted-foreground tracking-wide uppercase">
                    Discipline
                  </div>
                </div>
                {/* Streak */}
                <div className="col-span-2 glass rounded-xl p-6 flex flex-col justify-between shadow-elevated border-white/5 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)] transition-all duration-500" style={{ transform: "translateZ(40px)" }}>
                  <div className="text-sm text-muted-foreground tracking-wide uppercase">
                    Current Streak
                  </div>
                  <div>
                    <div className="text-5xl font-light tracking-tight text-white">
                      42<span className="text-xl text-muted-foreground ml-1 font-normal">days</span>
                    </div>
                    <div className="mt-2 text-sm text-blue-400 font-medium">+3 this week</div>
                  </div>
                </div>
                {/* XP */}
                <div className="col-span-2 glass rounded-xl p-6 flex flex-col justify-between shadow-elevated border-white/5 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(139,92,246,0.15)] transition-all duration-500" style={{ transform: "translateZ(50px)" }}>
                  <div className="text-sm text-muted-foreground tracking-wide uppercase">
                    Total XP
                  </div>
                  <div>
                    <div className="text-5xl font-light tracking-tight text-white">12k</div>
                    <div className="mt-2 text-sm text-cyan-400 font-medium">
                      Level 24 · Focus Mage
                    </div>
                  </div>
                </div>
                {/* Chart */}
                <div className="col-span-6 glass rounded-xl p-6 shadow-elevated border-white/5 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(6,182,212,0.1)] transition-all duration-500" style={{ transform: "translateZ(20px)" }}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-sm text-muted-foreground tracking-wide uppercase">
                      Weekly Trend
                    </div>
                    <div className="text-sm font-medium text-blue-400">+18% vs last week</div>
                  </div>
                  <MiniChart />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating badges */}
          <motion.div
            animate={{ y: [0, -15, 0], rotateZ: [0, -2, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-8 md:-left-20 top-32 glass-strong rounded-2xl px-5 py-4 hidden md:flex items-center gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.5)] border-white/10"
            style={{ transform: "translateZ(50px)" }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <div className="text-sm">
              <div className="font-medium text-white">Morning run</div>
              <div className="text-muted-foreground">completed · 6:04am</div>
            </div>
          </motion.div>
          <motion.div
            animate={{ y: [0, 15, 0], rotateZ: [0, 2, 0] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-8 md:-right-20 top-64 glass-strong rounded-2xl px-5 py-4 hidden md:flex items-center gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.5)] border-white/10"
            style={{ transform: "translateZ(80px)" }}
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <div className="text-sm">
              <div className="font-medium text-white">AI Suggestion</div>
              <div className="text-muted-foreground">Sleep 20 min earlier</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function RingChart({ value }: { value: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative w-32 h-32">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]"
      >
        <defs>
          <linearGradient id="ring-g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r={r} stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="none" />
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          stroke="url(#ring-g)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-light tracking-tight text-white">{value}</span>
      </div>
    </div>
  );
}

function MiniChart() {
  const points = [45, 62, 55, 78, 70, 88, 92];
  const max = 100;
  const w = 100;
  const h = 40;
  const step = w / (points.length - 1);
  const path = "M " + points.map((p, i) => `${i * step},${h - (p / max) * h}`).join(" L ");
  const area = path + ` L ${w},${h} L 0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-28" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chart-g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="chart-l" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill="url(#chart-g)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      />
      <motion.path
        d={path}
        stroke="url(#chart-l)"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
      />
    </svg>
  );
}
