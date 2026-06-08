import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { GitAgentNavbar } from "@/components/gitAgent/GitAgentNavbar";
import { GitAgentHeroSection } from "@/components/gitAgent/GitAgentHeroSection";
import { GitAgentWhySection } from "@/components/gitAgent/GitAgentWhySection";
import { GitAgentArchitectureSection } from "@/components/gitAgent/GitAgentArchitectureSection";
import { GitAgentInterfaces } from "@/components/gitAgent/GitAgentInterfaces";
import { GitAgentFeaturesSection } from "@/components/gitAgent/GitAgentFeaturesSection";
import { GitAgentModelsSection } from "@/components/gitAgent/GitAgentModelsSection";
import { GitAgentMemorySection } from "@/components/gitAgent/GitAgentMemorySection";
import { GitAgentIntegrationsSection } from "@/components/gitAgent/GitAgentIntegrationsSection";
import { GitAgentInstallSection } from "@/components/gitAgent/GitAgentInstallSection";
import { PatternsSection } from "@/components/PatternsSection";
import { Footer } from "@/components/Footer";

const overviewSections = [
  { id: "patterns", label: "Patterns" },
  { id: "why-gitagent", label: "Why" },
  { id: "interfaces", label: "Interfaces" },
  { id: "architecture", label: "Architecture" },
  { id: "features", label: "Features" },
  { id: "models", label: "Models" },
  { id: "memory", label: "Memory" },
  { id: "integrations", label: "Integrations" },
  { id: "install", label: "Install" },
];

const GitAgentPage = () => {
  const [activeSection, setActiveSection] = useState("");
  const [showPageNav, setShowPageNav] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    document.title = "GitAgent — Git-Native AI Agent";
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowPageNav(scrollY > 300);
      setShowBackToTop(scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    overviewSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <GitAgentNavbar variant="overview" />
      <div className="h-14" />

      {/* Sticky secondary page-nav */}
      {showPageNav && (
        <div className="fixed top-14 left-0 right-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1.5">
              {overviewSections.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`shrink-0 px-3 py-1 rounded text-xs font-body transition-colors ${
                    activeSection === id
                      ? "text-primary bg-primary/10 font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                  }`}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <main>
        <GitAgentHeroSection />
        <PatternsSection />
        <GitAgentWhySection />
        <GitAgentInterfaces />
        <GitAgentArchitectureSection />
        <GitAgentFeaturesSection />
        <GitAgentModelsSection />
        <GitAgentMemorySection />
        <GitAgentIntegrationsSection />
        <GitAgentInstallSection />
      </main>

      <Footer variant="gitagent" />

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 p-2 rounded-md sketch-border bg-background text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back to top"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default GitAgentPage;
