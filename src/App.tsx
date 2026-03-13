import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CrmView from "./pages/CrmView";
import NotFound from "./pages/NotFound";
import Lead360 from "./pages/Lead360";
import CrmView2 from "./pages/CrmView2";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/OMNI-Presales-Design">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/crm" element={<CrmView />} />
          <Route path="/lead-360" element={<Lead360 />} />
          <Route path="/crm2" element={<CrmView2 />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
