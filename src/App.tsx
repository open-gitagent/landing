import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GitAgentPage from "./pages/GitAgentPage";
import GitAgentDocsPage from "./pages/GitAgentDocsPage";
import OpenGAPDocsPage from "./pages/OpenGAPDocsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GitAgentPage />} />
          <Route path="/opengap" element={<Navigate to="/opengap/overview" replace />} />
          <Route path="/opengap/:section" element={<OpenGAPDocsPage />} />
          <Route path="/docs" element={<Navigate to="/docs/overview" replace />} />
          <Route path="/docs/:section" element={<GitAgentDocsPage />} />
          <Route path="/docs/:section/:subsection" element={<GitAgentDocsPage />} />
          <Route path="/docs/:section/:subsection/:page" element={<GitAgentDocsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
