import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import OfferingDetail from "./pages/OfferingDetail.tsx";
import EventsPage from "./pages/EventsPage.tsx";
import { BlogList, BlogPostPage } from "./pages/Blog.tsx";
import Podcasts from "./pages/Podcasts.tsx";
import EventSignup from "./pages/EventSignup.tsx";
import Ebook from "./pages/Ebook.tsx";
import ClarityCall from "./pages/ClarityCall.tsx";
import Intake from "./pages/Intake.tsx";
import EmailBuilder from "./pages/EmailBuilder.tsx";
import GuidePage from "./pages/GuidePage.tsx";
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
          <Route path="/reverence-retreat" element={<OfferingDetail slug="reverence-retreat" />} />
          <Route path="/reverenceretreat" element={<Navigate to="/reverence-retreat" replace />} />
          <Route path="/retreat" element={<Navigate to="/reverence-retreat" replace />} />
          <Route path="/womensretreat" element={<OfferingDetail slug="womens-retreat" />} />
          <Route path="/womansretreat" element={<Navigate to="/womensretreat" replace />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/podcasts" element={<Podcasts />} />
          <Route path="/events/:id" element={<EventSignup />} />
          <Route path="/ebook" element={<Ebook />} />
          <Route path="/coaching-call" element={<ClarityCall />} />
          <Route path="/intake" element={<Intake />} />
          <Route path="/email-builder" element={<EmailBuilder />} />
          <Route path="/prep/kambufo" element={<GuidePage slug="kambufo" />} />
          <Route path="/prep/microdose" element={<GuidePage slug="microdose" />} />
          <Route path="/integration" element={<GuidePage slug="integration" />} />
          <Route path="/bwintegration" element={<GuidePage slug="bwintegration" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
