import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => scrollY.on("change", (y) => setScrolled(y > 24)), [scrollY]);

  const links = [
    { label: "Features", href: "#features" },
    { label: "AI Coach", href: "#ai" },
    { label: "Dashboard", href: "#dashboard" },
  ];

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        scrolled ? "w-[min(94%,900px)]" : "w-[min(94%,1100px)]"
      }`}
    >
      <div className="glass-strong rounded-full flex items-center justify-between pl-5 pr-2 py-2 border border-white/10 bg-black/40 backdrop-blur-3xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        <a href="#top" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex-shrink-0">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 opacity-90 group-hover:opacity-100 transition-opacity animate-pulse-slow" />
            <div className="absolute inset-[1px] rounded-[7px] bg-background flex items-center justify-center backdrop-blur-md">
              <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            </div>
          </div>
          <span className="font-semibold tracking-tight text-[15px] group-hover:text-white transition-colors text-foreground/90">
            DisciplineOS
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-1.5">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-4 py-1.5 text-[13px] font-medium text-muted-foreground hover:text-white transition-all rounded-full hover:bg-white/[0.05]"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="hidden sm:inline-flex px-4 py-1.5 text-[13px] font-medium text-muted-foreground hover:text-white transition-colors"
          >
            Sign in
          </a>
          <a
            href="/register"
            className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-5 py-2 text-[13px] font-semibold hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            Get started
          </a>
        </div>
      </div>
    </motion.header>
  );
}
