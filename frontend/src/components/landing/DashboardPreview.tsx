import { motion } from "framer-motion";
import {
  Flame,
  Trophy,
  Zap,
  Activity,
  Clock,
  Settings,
  User,
  Bell,
  type LucideIcon,
} from "lucide-react";
import { memo } from "react";

export const DashboardPreview = memo(function DashboardPreview() {
  return (
    <section id="dashboard" className="relative py-32 md:py-44 z-10">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-16 motion-gpu"
        >
          <div className="text-[13px] font-medium tracking-wide text-blue-400 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            SYSTEM PREVIEW
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1]">
            Your entire life, <span className="text-muted-foreground">quantified.</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* OS Mockup Container */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong rounded-3xl p-2 md:p-3 shadow-elevated border-white/10 bg-black/20 backdrop-blur-3xl motion-gpu"
          >
            <div className="bg-[#030712]/80 rounded-[1.25rem] border border-white/5 overflow-hidden">
              {/* OS Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-6">
                  <div className="text-sm font-medium text-white tracking-wide">Overview</div>
                  <div className="text-sm font-medium text-muted-foreground hover:text-white transition-colors cursor-pointer">
                    Analytics
                  </div>
                  <div className="text-sm font-medium text-muted-foreground hover:text-white transition-colors cursor-pointer">
                    Logs
                  </div>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <Bell className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
                  <Settings className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px]">
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* OS Body */}
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.05),transparent_50%)]">
                {/* Stats Row */}
                <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatPanel
                    icon={Flame}
                    label="Consistency"
                    value="42"
                    suffix="days"
                    trend="+3 this week"
                  />
                  <StatPanel
                    icon={Trophy}
                    label="Focus Level"
                    value="24"
                    suffix="Mage"
                    trend="82% to next rank"
                    delay={0.1}
                  />
                  <StatPanel
                    icon={Zap}
                    label="Daily Energy"
                    value="8.5"
                    suffix="/10"
                    trend="Optimal state"
                    delay={0.2}
                  />
                </div>

                {/* Main Activity Panel */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.18 }}
                  className="md:col-span-8 glass rounded-2xl p-6 relative overflow-hidden group hover:bg-white/[0.04] transition-colors duration-500 motion-gpu"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-1">
                        Performance Index
                      </div>
                      <div className="text-4xl font-light tracking-tight text-white">
                        87<span className="text-lg text-muted-foreground ml-1">/100</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
                      <Activity className="w-3.5 h-3.5" />
                      Peak state
                    </div>
                  </div>

                  {/* Subtle Bar Chart */}
                  <div className="flex items-end gap-3 h-40">
                    {[62, 78, 55, 82, 74, 91, 87].map((v, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end group/bar relative">
                        <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono bg-white/10 px-2 py-1 rounded border border-white/10 transition-opacity">
                          {v}
                        </div>
                        <motion.div
                          initial={{ height: 0 }}
                          whileInView={{ height: `${v}%` }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.5,
                            delay: 0.12 + i * 0.03,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="w-full rounded-t-sm bg-blue-500/20 border-t border-blue-400/50 group-hover/bar:bg-blue-400/40 transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                      <span key={i}>{d}</span>
                    ))}
                  </div>
                </motion.div>

                {/* AI Intelligence Panel */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.24 }}
                  className="md:col-span-4 glass rounded-2xl p-6 relative overflow-hidden flex flex-col group hover:bg-white/[0.04] transition-colors duration-500 motion-gpu"
                >
                  <div className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-6">
                    Neural Insights
                  </div>
                  <div className="flex-1 flex flex-col gap-4">
                    {[
                      {
                        title: "Optimize sleep schedule",
                        desc: "Shift bedtime by -20m to align with deep sleep cycles.",
                        icon: Clock,
                        color: "text-blue-400",
                      },
                      {
                        title: "Focus threshold detected",
                        desc: "You perform 40% better during 9AM - 11AM blocks.",
                        icon: Activity,
                        color: "text-cyan-400",
                      },
                      {
                        title: "Habit chain at risk",
                        desc: "Hydration goal missed for 2 days. Drink 1L now.",
                        icon: Zap,
                        color: "text-red-400",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5"
                      >
                        <div className={`mt-0.5 ${item.color}`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white mb-1">{item.title}</div>
                          <div className="text-xs text-muted-foreground leading-relaxed">
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

const StatPanel = memo(function StatPanel({
  icon: Icon,
  label,
  value,
  suffix,
  trend,
  delay = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  suffix?: string;
  trend: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-2xl p-6 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)] border-white/5 hover:border-white/10 hover:bg-white/[0.04] motion-gpu"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
        <Icon className="w-4 h-4 text-blue-400 opacity-70 group-hover:opacity-100 transition-opacity" />
      </div>
      <div>
        <div className="text-4xl font-light tracking-tight text-white">
          {value}
          {suffix && (
            <span className="text-sm text-muted-foreground ml-1 font-normal">{suffix}</span>
          )}
        </div>
        <div className="mt-2 text-xs font-medium text-muted-foreground group-hover:text-blue-300 transition-colors">
          {trend}
        </div>
      </div>
    </motion.div>
  );
});
