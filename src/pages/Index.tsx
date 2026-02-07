import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ValuePropsSection } from "@/components/home/ValuePropsSection";
import { AudienceSection } from "@/components/home/AudienceSection";
import { LearningPathPreview } from "@/components/home/LearningPathPreview";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ValuePropsSection />
        <AudienceSection />
        <LearningPathPreview />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
