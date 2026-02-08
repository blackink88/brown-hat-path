import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

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
import NotFound from "./pages/NotFound";

// Dashboard pages
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import MyCourses from "./pages/dashboard/MyCourses";
import CommandCenter from "./pages/dashboard/CommandCenter";
import CoursePlayer from "./pages/dashboard/CoursePlayer";
import Profile from "./pages/dashboard/Profile";
import Settings from "./pages/dashboard/Settings";
import { AdminLayout } from "./components/dashboard/AdminLayout";
import AdminOverview from "./pages/dashboard/admin/AdminOverview";
import AdminCourses from "./pages/dashboard/admin/AdminCourses";
import AdminUsers from "./pages/dashboard/admin/AdminUsers";
import AdminQuizzes from "./pages/dashboard/admin/AdminQuizzes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
        <BrowserRouter>
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

            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="courses" element={<MyCourses />} />
              <Route path="skills" element={<CommandCenter />} />
              <Route path="course/:courseCode" element={<CoursePlayer />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<AdminOverview />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="quizzes" element={<AdminQuizzes />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
            </Route>

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
