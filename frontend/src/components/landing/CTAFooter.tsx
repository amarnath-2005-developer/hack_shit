import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTAFooter() {
  return (
    <section id="cta" className="relative py-32 md:py-40 z-10">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="relative glass-strong rounded-[2rem] overflow-hidden text-center px-8 py-24 border border-white/10 shadow-elevated bg-black/40 backdrop-blur-3xl"
        >
          {/* Subtle light beam */}
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[100px] animate-pulse-slow" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight leading-[1.1]">
              Start the version of you
              <br />
              <span className="text-muted-foreground">you keep promising.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto font-light tracking-wide">
              Free forever for individuals. No credit card. Under 60 seconds to first insight.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#"
                className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-8 py-3.5 text-[15px] font-medium hover:bg-white/90 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:scale-105 hover:shadow-[0_0_60px_rgba(255,255,255,0.25)]"
              >
                Start building
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 glass rounded-full px-8 py-3.5 text-[15px] font-medium hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                Talk to founders
              </a>
            </div>
          </div>
        </motion.div>

        <footer className="mt-32 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground border-t border-white/10 pt-8">
          <div className="flex items-center gap-3">
            <div className="relative w-7 h-7 flex-shrink-0">
              <div className="absolute inset-0 rounded-md bg-gradient-to-br from-blue-500 to-cyan-400 opacity-90" />
              <div className="absolute inset-[1px] rounded-[5px] bg-background flex items-center justify-center backdrop-blur-md">
                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </div>
            </div>
            <span className="font-medium text-white tracking-wide">DisciplineOS</span>
            <span className="opacity-50">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Changelog
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Twitter
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
}
