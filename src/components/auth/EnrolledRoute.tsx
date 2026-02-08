import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEnrollmentStatus } from "@/hooks/useEnrollmentStatus";
import { Loader2 } from "lucide-react";

interface EnrolledRouteProps {
  children: React.ReactNode;
}

export function EnrolledRoute({ children }: EnrolledRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { isEnrolled, isLoading: enrollmentLoading } = useEnrollmentStatus();
  const location = useLocation();

  if (authLoading || enrollmentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isEnrolled) {
    return <Navigate to="/pricing" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
