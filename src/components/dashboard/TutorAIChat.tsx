import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface TutorAIChatProps {
  lessonContext?: string;
  courseContext?: string;
}

export function TutorAIChat({ lessonContext, courseContext }: TutorAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `👋 I'm your AI tutor! I'm here to help you understand ${courseContext || "cybersecurity"} concepts. Ask me anything about the current lesson, and I'll guide you through it.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response - in production, call your AI endpoint
    setTimeout(() => {
      const responses = [
        "Great question! In cybersecurity, this concept is fundamental because it helps protect systems from unauthorized access. Let me break it down for you...",
        "That's a common area of confusion. Think of it like this: just as you lock your front door, network security involves multiple layers of protection.",
        "Let me explain with an example. When data travels across a network, encryption ensures that even if intercepted, it remains unreadable to attackers.",
        "This is directly related to what you're learning. The key principle here is 'defense in depth' - never rely on a single security measure.",
        "I can see you're thinking critically! The answer involves understanding how attackers think, which is exactly what this lesson covers.",
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="rounded-xl border border-border bg-card flex flex-col h-full min-h-[300px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-2 shrink-0">
        <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-accent" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">AI Tutor</p>
          <p className="text-xs text-muted-foreground">
            {lessonContext ? `Helping with: ${lessonContext}` : "Ask me anything"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" && "flex-row-reverse"
              )}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                  message.role === "assistant"
                    ? "bg-accent/10"
                    : "bg-primary/10"
                )}
              >
                {message.role === "assistant" ? (
                  <Bot className="h-4 w-4 text-accent" />
                ) : (
                  <User className="h-4 w-4 text-primary" />
                )}
              </div>
              <div
                className={cn(
                  "rounded-xl px-4 py-2 max-w-[80%]",
                  message.role === "assistant"
                    ? "bg-muted/50"
                    : "bg-primary text-primary-foreground"
                )}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-accent" />
              </div>
              <div className="bg-muted/50 rounded-xl px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border shrink-0">
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question about this lesson..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
