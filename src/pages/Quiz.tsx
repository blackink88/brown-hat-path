import { AptitudeQuiz } from "@/components/quiz/AptitudeQuiz";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Sparkles } from "lucide-react";

export default function Quiz() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Discover Your Path
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Cybersecurity Aptitude Quiz
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See if cybersecurity is for you. Answer a few questions to discover your cybersecurity persona and find the career path that matches your natural strengths.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This is a discovery quiz. Course lesson quizzes are inside each course in your dashboard.
            </p>
          </div>

          {/* Quiz */}
          <AptitudeQuiz />
        </div>
      </main>

      <Footer />
    </div>
  );
}
