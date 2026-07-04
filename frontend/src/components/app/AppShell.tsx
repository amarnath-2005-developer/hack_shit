import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative min-h-screen bg-[#030712] text-foreground selection:bg-blue-500/30 selection:text-white">
      {/* Premium subtle grid backdrop */}
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_top,black,transparent_80%)]" />
      {/* Top ambient glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full" />

      <Sidebar open={open} onOpenChange={setOpen} />

      <main className="relative lg:pl-[20rem] pt-20 lg:pt-8 pb-16 px-4 sm:px-6 lg:pr-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
