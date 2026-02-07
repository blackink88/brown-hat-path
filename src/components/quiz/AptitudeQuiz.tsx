import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Scale, Target, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type PersonaType = "guardian" | "architect" | "scout";

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    persona: PersonaType;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "A colleague's computer is running slowly. What's your first instinct?",
    options: [
      { text: "Check system logs and diagnose the issue step-by-step", persona: "guardian" },
      { text: "Review if it's compliant with security policies", persona: "architect" },
      { text: "Wonder what's lurking inside and how to exploit it", persona: "scout" },
    ],
  },
  {
    id: 2,
    text: "You discover a security vulnerability in your company's website. What do you do?",
    options: [
      { text: "Document it and report through proper channels", persona: "architect" },
      { text: "Set up monitoring to detect if anyone exploits it", persona: "guardian" },
      { text: "Test how far you can push it to understand the full impact", persona: "scout" },
    ],
  },
  {
    id: 3,
    text: "Which activity sounds most exciting to you?",
    options: [
      { text: "Monitoring dashboards and hunting for anomalies", persona: "guardian" },
      { text: "Writing policies that protect the organization", persona: "architect" },
      { text: "Participating in capture-the-flag competitions", persona: "scout" },
    ],
  },
  {
    id: 4,
    text: "How do you approach a complex problem?",
    options: [
      { text: "Break it down logically and troubleshoot each part", persona: "guardian" },
      { text: "Research best practices and frameworks first", persona: "architect" },
      { text: "Experiment and try unconventional approaches", persona: "scout" },
    ],
  },
  {
    id: 5,
    text: "What motivates you most in cybersecurity?",
    options: [
      { text: "Protecting people and systems from threats", persona: "guardian" },
      { text: "Building frameworks that prevent problems", persona: "architect" },
      { text: "Outsmarting adversaries and finding weaknesses", persona: "scout" },
    ],
  },
];

const personas = {
  guardian: {
    title: "The Guardian",
    role: "SOC Analyst",
    icon: Shield,
    description: "You're a natural defender. Your logical mind and troubleshooting skills make you perfect for monitoring, detecting, and responding to security threats in real-time.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  architect: {
    title: "The Architect",
    role: "GRC / Policy Specialist",
    icon: Scale,
    description: "You think in systems and frameworks. Your ethical foundation and love for structure make you ideal for governance, risk management, and compliance roles.",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
  },
  scout: {
    title: "The Scout",
    role: "Offensive Security",
    icon: Target,
    description: "You think like an attacker. Your curiosity and puzzle-solving mindset make you a natural for penetration testing, red teaming, and vulnerability research.",
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
  },
};

interface AptitudeQuizProps {
  onComplete?: (persona: PersonaType) => void;
}

export function AptitudeQuiz({ onComplete }: AptitudeQuizProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<PersonaType[]>([]);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [result, setResult] = React.useState<PersonaType | null>(null);

  const isQuizComplete = currentStep >= questions.length;
  const progress = (currentStep / questions.length) * 100;

  const handleOptionSelect = (optionIndex: number, persona: PersonaType) => {
    setSelectedOption(optionIndex);
    
    setTimeout(() => {
      const newAnswers = [...answers, persona];
      setAnswers(newAnswers);
      
      if (currentStep === questions.length - 1) {
        // Calculate result
        const counts: Record<PersonaType, number> = { guardian: 0, architect: 0, scout: 0 };
        newAnswers.forEach((p) => counts[p]++);
        
        const maxCount = Math.max(...Object.values(counts));
        const resultPersona = (Object.keys(counts) as PersonaType[]).find(
          (key) => counts[key] === maxCount
        ) as PersonaType;
        
        setResult(resultPersona);
        onComplete?.(resultPersona);
      }
      
      setCurrentStep((prev) => prev + 1);
      setSelectedOption(null);
    }, 300);
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers([]);
    setSelectedOption(null);
    setResult(null);
  };

  if (result) {
    const persona = personas[result];
    const PersonaIcon = persona.icon;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg mx-auto"
      >
        <div className={cn(
          "relative overflow-hidden rounded-2xl border-2 p-8",
          persona.borderColor,
          persona.bgColor
        )}>
          {/* Background gradient */}
          <div className={cn(
            "absolute inset-0 opacity-10 bg-gradient-to-br",
            persona.color
          )} />
          
          <div className="relative z-10 text-center">
            {/* Icon */}
            <div className={cn(
              "mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br",
              persona.color
            )}>
              <PersonaIcon className="h-10 w-10 text-white" />
            </div>

            {/* Title */}
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Your Cybersecurity Persona
            </p>
            <h2 className={cn(
              "text-3xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent",
              persona.color
            )}>
              {persona.title}
            </h2>
            <p className="text-lg font-medium text-foreground mb-4">
              {persona.role}
            </p>

            {/* Description */}
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {persona.description}
            </p>

            {/* CTA */}
            <div className="space-y-3">
              <Button
                size="lg"
                className={cn(
                  "w-full bg-gradient-to-r text-white shadow-lg hover:opacity-90",
                  persona.color
                )}
                asChild
              >
                <Link to="/dashboard/course/bh-bridge">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetQuiz}
                className="text-muted-foreground"
              >
                Retake Quiz
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">
            Question {currentStep + 1} of {questions.length}
          </span>
          <span className="font-medium text-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-foreground mb-6">
            {currentQuestion.text}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleOptionSelect(index, option.persona)}
                disabled={selectedOption !== null}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                  "hover:border-primary hover:bg-primary/5",
                  selectedOption === index
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{option.text}</span>
                  <ChevronRight className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform",
                    selectedOption === index && "text-primary translate-x-1"
                  )} />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
