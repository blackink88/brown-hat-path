import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import bhlogo from "@/assets/bhlogo.png";
import { useAuth } from "@/contexts/AuthContext";

const FRAPPE_LMS_URL = import.meta.env.VITE_FRAPPE_URL as string || "https://lms-dzr-tbs.c.frappe.cloud";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Learning Path", href: "/learning-path" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "For Employers", href: "/employers" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, tierLevel } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src={bhlogo} 
            alt="Brown Hat Academy" 
            className="h-10 w-auto transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-4 py-2 text-base font-medium rounded-md transition-colors",
                location.pathname === link.href
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            tierLevel > 0 ? (
              // Subscribed — go straight to courses
              <Button size="default" asChild>
                <a href={FRAPPE_LMS_URL} target="_blank" rel="noopener noreferrer">
                  My Courses <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </a>
              </Button>
            ) : (
              // Logged in but no subscription
              <Button size="default" asChild>
                <Link to="/pricing">Subscribe to Learn</Link>
              </Button>
            )
          ) : (
            <>
              <Button variant="ghost" size="default" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button size="default" asChild>
                <Link to="/enroll">Start Learning</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-3 text-base font-medium rounded-md transition-colors",
                  location.pathname === link.href
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
              {user ? (
                tierLevel > 0 ? (
                  <Button asChild>
                    <a href={FRAPPE_LMS_URL} target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>
                      My Courses <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                    </a>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>Subscribe to Learn</Link>
                  </Button>
                )
              ) : (
                <>
                  <Button variant="outline" asChild>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      Log In
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to="/enroll" onClick={() => setMobileMenuOpen(false)}>
                      Start Learning
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
