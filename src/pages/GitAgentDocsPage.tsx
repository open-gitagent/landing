import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { GitAgentNavbar } from "@/components/gitAgent/GitAgentNavbar";
import { GitAgentSidebar } from "@/components/gitAgent/GitAgentSidebar";
import { GitAgentOverview } from "@/components/gitAgent/GitAgentOverview";
import { GitAgentArchitecture } from "@/components/gitAgent/GitAgentArchitecture";
import { GitAgentInterfaces } from "@/components/gitAgent/GitAgentInterfaces";
import { GitAgentMessaging } from "@/components/gitAgent/GitAgentMessaging";
import { GitAgentQuickStart } from "@/components/gitAgent/GitAgentQuickStart";
import { GitAgentQuickStartPersonalAssistant } from "@/components/gitAgent/GitAgentQuickStartPersonalAssistant";
import { GitAgentQuickStartSDK } from "@/components/gitAgent/GitAgentQuickStartSDK";
import { GitAgentCookbookRefactorRepo } from "@/components/gitAgent/GitAgentCookbookRefactorRepo";
import { GitAgentCookbookSummarizeEmails } from "@/components/gitAgent/GitAgentCookbookSummarizeEmails";
import { GitAgentCookbookCodeReview } from "@/components/gitAgent/GitAgentCookbookCodeReview";
import { GitAgentCookbookCustomTool } from "@/components/gitAgent/GitAgentCookbookCustomTool";
import { GitAgentCookbookMultiAgentHandoff } from "@/components/gitAgent/GitAgentCookbookMultiAgentHandoff";
import { GitAgentCookbookScheduledCron } from "@/components/gitAgent/GitAgentCookbookScheduledCron";
import { GitAgentCLI } from "@/components/gitAgent/GitAgentCLI";
import { GitAgentModels } from "@/components/gitAgent/GitAgentModels";
import { GitAgentWebUI } from "@/components/gitAgent/GitAgentWebUI";
import { GitAgentTools } from "@/components/gitAgent/GitAgentTools";
import { GitAgentSkills } from "@/components/gitAgent/GitAgentSkills";
import { GitAgentWorkflows } from "@/components/gitAgent/GitAgentWorkflows";
import { GitAgentHooks } from "@/components/gitAgent/GitAgentHooks";
import { GitAgentPlugins } from "@/components/gitAgent/GitAgentPlugins";
import { GitAgentMemory } from "@/components/gitAgent/GitAgentMemory";
import { GitAgentSchedules } from "@/components/gitAgent/GitAgentSchedules";
import { GitAgentIntegrations } from "@/components/gitAgent/GitAgentIntegrations";
import { GitAgentCompliance } from "@/components/gitAgent/GitAgentCompliance";
import { GitAgentSDK } from "@/components/gitAgent/GitAgentSDK";
import { GitAgentUtilities, GitAgentTelemetry } from "@/components/gitAgent/GitAgentUtilities";
import { GitAgentSecurity } from "@/components/gitAgent/GitAgentSecurity";
import { GitAgentEnvVars } from "@/components/gitAgent/GitAgentEnvVars";
import { sidebarGroups } from "@/components/gitAgent/GitAgentSidebar";
import { Footer } from "@/components/Footer";
import { useState } from "react";

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  overview: GitAgentOverview,
  quickstart: GitAgentQuickStart,
  interfaces: GitAgentInterfaces,
  architecture: GitAgentArchitecture,
  cli: GitAgentCLI,
  models: GitAgentModels,
  env: GitAgentEnvVars,
  webui: GitAgentWebUI,
  messaging: GitAgentMessaging,
  tools: GitAgentTools,
  skills: GitAgentSkills,
  workflows: GitAgentWorkflows,
  hooks: GitAgentHooks,
  plugins: GitAgentPlugins,
  memory: GitAgentMemory,
  schedules: GitAgentSchedules,
  integrations: GitAgentIntegrations,
  compliance: GitAgentCompliance,
  security: GitAgentSecurity,
  sdk: GitAgentSDK,
  utilities: GitAgentUtilities,
  telemetry: GitAgentTelemetry,
  "quickstart/personal-assistant": GitAgentQuickStartPersonalAssistant,
  "quickstart/sdk": GitAgentQuickStartSDK,
  "sdk/cookbooks/refactor-repo": GitAgentCookbookRefactorRepo,
  "sdk/cookbooks/summarize-emails": GitAgentCookbookSummarizeEmails,
  "sdk/cookbooks/code-review": GitAgentCookbookCodeReview,
  "sdk/cookbooks/custom-tool": GitAgentCookbookCustomTool,
  "sdk/cookbooks/multi-agent-handoff": GitAgentCookbookMultiAgentHandoff,
  "sdk/cookbooks/scheduled-cron": GitAgentCookbookScheduledCron,
};

const ALL_ITEMS = sidebarGroups.flatMap((g) => g.items).filter((item) => !("divider" in item && item.divider));

const GitAgentDocsPage = () => {
  const { section = "overview", subsection, page } = useParams<{ section: string; subsection?: string; page?: string }>();
  const sectionKey = page ? `${section}/${subsection}/${page}` : subsection ? `${section}/${subsection}` : section;
  const [showBackToTop, setShowBackToTop] = useState(false);

  const currentIndex = ALL_ITEMS.findIndex((item) => item.id === sectionKey);
  const prevItem = currentIndex > 0 ? ALL_ITEMS[currentIndex - 1] : null;
  const nextItem = currentIndex < ALL_ITEMS.length - 1 ? ALL_ITEMS[currentIndex + 1] : null;

  const SectionComponent = SECTION_COMPONENTS[sectionKey] ?? GitAgentOverview;
  const currentLabel = ALL_ITEMS.find((item) => item.id === sectionKey)?.label ?? "Docs";

  useEffect(() => {
    document.title = `GitAgent Docs — ${currentLabel}`;
    window.scrollTo(0, 0);
  }, [sectionKey, currentLabel]);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-clip">
      <GitAgentNavbar />

      <div className="pt-14 lg:flex max-w-7xl mx-auto">
        <GitAgentSidebar activeSection={sectionKey} />

        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 pb-24">
          <SectionComponent />

          {/* Prev / Next navigation */}
          <div className="flex items-center justify-between mt-16 pt-8 border-t border-border">
            {prevItem ? (
              <a
                href={`/docs/${prevItem.id}`}
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
                href={`/docs/${nextItem.id}`}
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

      <Footer variant="gitagent" />

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

export default GitAgentDocsPage;
