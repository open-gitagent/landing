import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { OpenGAPNavbar } from "@/components/opengap/OpenGAPNavbar";
import { OpenGAPSidebar, opengapAllItems } from "@/components/opengap/OpenGAPSidebar";
import { HeroSection } from "@/components/HeroSection";

const HeroSectionDocs = () => <HeroSection noBackground />;
import { QuickStartSection } from "@/components/QuickStartSection";
import { WhySection } from "@/components/WhySection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { CLISection } from "@/components/CLISection";
import { ImportSection } from "@/components/ImportSection";
import { ExportSection } from "@/components/ExportSection";
import { AdaptersSection } from "@/components/AdaptersSection";
import { SkillsSection } from "@/components/SkillsSection";
import { SkillsFlowSection } from "@/components/SkillsFlowSection";
import { ComplianceSection } from "@/components/ComplianceSection";
import { FAQSection } from "@/components/FAQSection";
import { CookbookFrameworkTranslator } from "@/components/opengap/cookbook/CookbookFrameworkTranslator";
import { CookbookClaudeCode } from "@/components/opengap/cookbook/CookbookClaudeCode";
import { CookbookCursor } from "@/components/opengap/cookbook/CookbookCursor";
import { CookbookGeminiCLI } from "@/components/opengap/cookbook/CookbookGeminiCLI";
import { CookbookCodex } from "@/components/opengap/cookbook/CookbookCodex";
import { CookbookOpenCode } from "@/components/opengap/cookbook/CookbookOpenCode";
import { Footer } from "@/components/Footer";

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  overview: HeroSectionDocs,
  quickstart: QuickStartSection,
  why: WhySection,
  "how-it-works": HowItWorksSection,
  cli: CLISection,
  import: ImportSection,
  export: ExportSection,
  adapters: AdaptersSection,
  skills: SkillsSection,
  skillflow: SkillsFlowSection,
  compliance: ComplianceSection,
  faq: FAQSection,
  "cookbook-framework-translator": CookbookFrameworkTranslator,
  "cookbook-claude-code": CookbookClaudeCode,
  "cookbook-cursor": CookbookCursor,
  "cookbook-gemini-cli": CookbookGeminiCLI,
  "cookbook-codex": CookbookCodex,
  "cookbook-opencode": CookbookOpenCode,
};

const ALL_ITEMS = opengapAllItems;

const OpenGAPDocsPage = () => {
  const { section = "overview" } = useParams<{ section: string }>();
  const [showBackToTop, setShowBackToTop] = useState(false);

  const currentIndex = ALL_ITEMS.findIndex((item) => item.id === section);
  const prevItem = currentIndex > 0 ? ALL_ITEMS[currentIndex - 1] : null;
  const nextItem = currentIndex < ALL_ITEMS.length - 1 ? ALL_ITEMS[currentIndex + 1] : null;

  const SectionComponent = SECTION_COMPONENTS[section] ?? HeroSection;
  const currentLabel = ALL_ITEMS.find((item) => item.id === section)?.label ?? "Overview";

  useEffect(() => {
    document.title = `OpenGAP — ${currentLabel}`;
    window.scrollTo(0, 0);
  }, [section, currentLabel]);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <OpenGAPNavbar />

      <div className="lg:flex max-w-7xl mx-auto">
        <OpenGAPSidebar activeSection={section} />

        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 pb-24">
          {section.startsWith("cookbook-") && (
            <a
              href="/opengap/import"
              className="inline-flex items-center gap-1.5 mt-14 text-xs text-muted-foreground hover:text-foreground transition-colors font-body group"
            >
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back to Import
            </a>
          )}
          <SectionComponent />

          <div className="flex items-center justify-between mt-16 pt-8 border-t border-border">
            {prevItem ? (
              <a
                href={`/opengap/${prevItem.id}`}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors font-body group"
              >
                <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>
                  <span className="block text-[10px] text-muted-foreground/50 uppercase tracking-widest mb-0.5">Previous</span>
                  {prevItem.label}
                </span>
              </a>
            ) : <div />}
            {nextItem ? (
              <a
                href={`/opengap/${nextItem.id}`}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors font-body group text-right"
              >
                <span>
                  <span className="block text-[10px] text-muted-foreground/50 uppercase tracking-widest mb-0.5">Next</span>
                  {nextItem.label}
                </span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            ) : <div />}
          </div>
        </main>
      </div>

      <Footer />

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

export default OpenGAPDocsPage;
