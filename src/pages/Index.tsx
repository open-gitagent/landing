import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { WhySection } from "@/components/WhySection";
import { PatternsSection } from "@/components/PatternsSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { ExportSection } from "@/components/ExportSection";
import { CLISection } from "@/components/CLISection";
import { AdaptersSection } from "@/components/AdaptersSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ComplianceSection } from "@/components/ComplianceSection";
import { FAQSection } from "@/components/FAQSection";
import { QuickStartSection } from "@/components/QuickStartSection";
import { Footer } from "@/components/Footer";
import { DiscordBanner } from "@/components/DiscordBanner";
import { RegistryBanner } from "@/components/RegistryBanner";
import { useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
import { track } from "@/lib/analytics";

const Index = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyAll = () => {
    if (contentRef.current) {
      const text = contentRef.current.innerText;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      track('copy_page_content');
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden" ref={contentRef}>
      <Navbar />
      <button
        onClick={handleCopyAll}
        className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-[60] inline-flex items-center gap-1.5 sketch-border rounded-md px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-body text-muted-foreground hover:text-foreground hover:bg-accent transition-colors bg-background/90 backdrop-blur-sm shadow-lg"
        aria-label="Copy page content"
      >
        {copied ? <><Check className="w-3.5 h-3.5 text-primary" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Page</>}
      </button>
      <main>
        <HeroSection />
        <RegistryBanner />
        <PatternsSection />
        <WhySection />
        <HowItWorksSection />
        <ExportSection />
        <CLISection />
        <AdaptersSection />
        <SkillsSection />
        <ComplianceSection />
        <FAQSection />
        <QuickStartSection />
      </main>
      <DiscordBanner />
      <Footer />
    </div>
  );
};

export default Index;
