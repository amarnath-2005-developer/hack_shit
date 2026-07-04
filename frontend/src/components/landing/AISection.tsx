import { motion, useInView } from "framer-motion";
import { Sparkles, ArrowUp } from "lucide-react";
import { memo, useRef } from "react";

const script = [
  { role: "user", text: "I felt off yesterday. What happened?" },
  {
    role: "ai",
    text: "Your sleep dropped to 5h 42m and your first deep-work block started 90 minutes late. Historically that combo drops your discipline score by ~14 points.",
  },
  { role: "user", text: "How do I fix today?" },
  {
    role: "ai",
    text: "Lock the 9:30–11:00 focus window, defer email until noon, and cap caffeine at 2pm. I've queued a wind-down reminder at 10:15pm.",
  },
];

export const AISection = memo(function AISection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="ai" ref={ref} className="relative py-32 md:py-44 overflow-hidden z-10">
      <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <div className="text-[13px] font-medium tracking-wide text-blue-400 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            AI INTELLIGENCE
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1]">
            A coach that <span className="text-muted-foreground">actually knows you.</span>
          </h2>
          <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-xl font-light">
            Trained on your habits, sleep, focus and logs — not generic advice. Ask anything. Get
            answers rooted in your real behavior.
          </p>
          <ul className="mt-10 space-y-4 text-sm font-medium">
            {[
              "Diagnoses off-days by cross-referencing your data",
              "Rewrites tomorrow based on what worked this week",
              "Predicts burnout 5–10 days before it hits",
            ].map((t) => (
              <li key={t} className="flex items-start gap-4">
                <div className="mt-0.5 w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                </div>
                <span className="text-foreground leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat panel */}
        <div className="relative">
          {/* Orb */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-600/20 via-cyan-500/10 to-transparent blur-[80px]" />

          <div className="relative glass-strong rounded-[1.5rem] p-6 md:p-8 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] border border-white/10 bg-black/40 backdrop-blur-3xl">
            <div className="flex items-center gap-4 pb-5 mb-5 border-b border-white/10">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 animate-pulse opacity-80" />
                <div className="absolute inset-[2px] rounded-full bg-background flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <div className="text-[15px] font-medium text-white tracking-wide">
                  DisciplineOS Coach
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5 uppercase tracking-widest font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                  ONLINE · ANALYZING
                </div>
              </div>
            </div>

            <div className="space-y-4 min-h-[340px] flex flex-col justify-end">
              {inView &&
                script.map((m, i) => (
                  <ChatBubble
                    key={i}
                    role={m.role as "user" | "ai"}
                    text={m.text}
                    delay={i * 0.35}
                  />
                ))}
            </div>

            <div className="mt-6 bg-white/[0.03] border border-white/10 rounded-full flex items-center pl-5 pr-2 py-2 hover:bg-white/[0.05] transition-colors shadow-inner">
              <input
                readOnly
                placeholder="Ask your coach anything…"
                className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground outline-none text-white font-medium"
              />
              <button className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-400 transition-colors flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                <ArrowUp className="w-4 h-4 text-white" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

const ChatBubble = memo(function ChatBubble({
  role,
  text,
  delay,
}: {
  role: "user" | "ai";
  text: string;
  delay: number;
}) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`flex motion-gpu ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-[1.25rem] px-5 py-3.5 text-[13px] md:text-sm leading-relaxed tracking-wide font-medium shadow-elevated ${
          isUser
            ? "bg-white/[0.04] border border-white/10 text-foreground"
            : "bg-blue-500/10 border border-blue-500/20 text-white"
        }`}
      >
        {text}
      </div>
    </motion.div>
  );
});
