import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useEffect } from "react";

const FRAPPE_LMS_URL = import.meta.env.VITE_FRAPPE_URL as string || "https://lms-dzr-tbs.c.frappe.cloud";

// Redirect any /dashboard/* visits to Frappe LMS — all learning happens there
function FrappeLMSRedirect() {
  useEffect(() => { window.location.href = FRAPPE_LMS_URL; }, []);
  return null;
}

// Public pages
import Index from "./pages/Index";
import LearningPath from "./pages/LearningPath";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Employers from "./pages/Employers";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Login from "./pages/Login";
import Enroll from "./pages/Enroll";
import Certifications from "./pages/Certifications";
import Students from "./pages/Students";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Quiz from "./pages/Quiz";
import PublicPortfolio from "./pages/PublicPortfolio";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyCertificate from "./pages/VerifyCertificate";
import FrappeSSO from "./pages/FrappeSSO";
import PaymentCallback from "./pages/PaymentCallback";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/learning-path" element={<LearningPath />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/employers" element={<Employers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/login" element={<Login />} />
            <Route path="/enroll" element={<Enroll />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/students" element={<Students />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/p/:slug" element={<PublicPortfolio />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify/:certNumber" element={<VerifyCertificate />} />
            {/* SSO bridge — auto-logs user into Frappe after React login */}
            <Route path="/frappe-sso" element={<FrappeSSO />} />
            {/* Paystack redirect callback — activates subscription after hosted checkout */}
            <Route path="/payment-callback" element={<PaymentCallback />} />
            {/* /dashboard and /course both live on Frappe LMS now */}
            <Route path="/dashboard/*" element={<FrappeLMSRedirect />} />
            <Route path="/course/*" element={<FrappeLMSRedirect />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
