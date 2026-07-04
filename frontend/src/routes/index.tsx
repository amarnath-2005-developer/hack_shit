import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@/components/ClientOnly";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { AISection } from "@/components/landing/AISection";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { CTAFooter } from "@/components/landing/CTAFooter";
import { ParticleField } from "@/components/landing/ParticleField";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen bg-[#030712] text-foreground overflow-hidden selection:bg-blue-500/30 selection:text-white">
      <div className="noise-bg z-50 mix-blend-overlay opacity-30" />
      <ClientOnly>
        <ParticleField />
      </ClientOnly>
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Features />
        <AISection />
        <DashboardPreview />
        <CTAFooter />
      </main>
    </div>
  );
}
