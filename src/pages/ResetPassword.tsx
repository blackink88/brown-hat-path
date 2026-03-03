import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail } from "lucide-react";

/**
 * Password reset landing page.
 *
 * Password reset emails now link to the Frappe learning portal, not this page.
 * This page serves as a friendly fallback for users who navigate here directly.
 */
const ResetPassword = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
            <CardDescription>
              Follow the link in your reset email to set a new password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              The reset link in your email will take you to the learning portal where
              you can set your new password. Once updated, return here to log in.
            </p>
            <p className="text-sm text-muted-foreground">
              Didn't receive an email?{" "}
              <Link to="/forgot-password" className="text-primary hover:underline font-medium">
                Request a new link
              </Link>
            </p>
            <Button variant="outline" asChild className="w-full">
              <Link to="/login">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;
