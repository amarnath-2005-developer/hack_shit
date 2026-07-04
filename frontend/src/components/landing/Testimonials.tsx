import { motion } from "framer-motion";

const quotes = [
  {
    q: "I've tried every habit app. DisciplineOS is the first one that felt like it was actually built for how humans work.",
    n: "Ava Chen",
    r: "Founder, Northwind",
  },
  {
    q: "The AI coach told me I was heading toward burnout six days before I felt it. That's the whole product for me.",
    n: "Marcus Reid",
    r: "PM, Linear",
  },
  {
    q: "It's like Raycast met a psychologist. Insanely fast, quietly brilliant.",
    n: "Priya Natarajan",
    r: "Design Lead, Fjord",
  },
  {
    q: "Down 11kg, up 3 book habits, and my calendar finally makes sense.",
    n: "Diego Alvarez",
    r: "Software Engineer",
  },
  {
    q: "The dashboard alone is worth the subscription. I open it more than Twitter.",
    n: "Sana Ali",
    r: "Writer",
  },
  {
    q: "Compounding discipline is a feature now. Wild.",
    n: "Tomás Weber",
    r: "Investor",
  },
];

export function Testimonials() {
  return (
    <section id="reviews" className="relative py-32 md:py-44 z-10">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mb-16"
        >
          <div className="text-[13px] font-medium tracking-wide text-blue-400 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            COMMUNITY
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1]">
            Loved by people who <span className="text-muted-foreground">actually ship.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {quotes.map((q, i) => (
            <motion.figure
              key={q.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass rounded-[1.5rem] p-7 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-500 hover:bg-white/[0.04] border-white/5 hover:border-white/10 hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)]"
            >
              <blockquote className="text-[15px] leading-relaxed text-foreground/90 font-light">
                &ldquo;{q.q}&rdquo;
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 p-[1.5px] shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-shadow">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-xs font-semibold text-white">
                    {q.n
                      .split(" ")
                      .map((x) => x[0])
                      .join("")}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{q.n}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{q.r}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
