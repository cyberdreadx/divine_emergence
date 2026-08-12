import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import OfferingDetail from "./pages/OfferingDetail.tsx";
import EventsPage from "./pages/EventsPage.tsx";
import Ebook from "./pages/Ebook.tsx";
import NotFound from "./pages/NotFound.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/offerings/:slug" element={<OfferingDetail />} />
          <Route path="/retreat" element={<OfferingDetail slug="womens-retreat" />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/ebook" element={<Ebook />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
