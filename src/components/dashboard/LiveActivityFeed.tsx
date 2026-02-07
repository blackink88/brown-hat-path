import { useEffect, useState } from "react";
import { Activity, Shield, Trophy, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  course?: string;
  timestamp: Date;
  type: "completion" | "achievement" | "lab" | "milestone";
}

// Mock activity data - in production this would come from Supabase Realtime
const generateMockActivity = (): ActivityItem => {
  const users = [
    "User #402",
    "User #891",
    "User #156",
    "User #723",
    "User #445",
    "User #667",
    "User #334",
    "User #998",
  ];
  const actions = [
    { text: "mitigated a DDoS attack", type: "lab" as const },
    { text: "completed Network Fundamentals", type: "completion" as const },
    { text: "earned Security+ badge", type: "achievement" as const },
    { text: "passed BGP routing lab", type: "lab" as const },
    { text: "reached Level 2 in SOC track", type: "milestone" as const },
    { text: "detected a phishing attempt", type: "lab" as const },
    { text: "configured firewall rules", type: "lab" as const },
    { text: "completed incident response drill", type: "lab" as const },
  ];
  const courses = ["Foundations Level 2", "Bridge Program", "Core Cyber", "SOC Analyst Track"];

  const action = actions[Math.floor(Math.random() * actions.length)];

  return {
    id: Math.random().toString(36).substr(2, 9),
    user: users[Math.floor(Math.random() * users.length)],
    action: action.text,
    course: courses[Math.floor(Math.random() * courses.length)],
    timestamp: new Date(),
    type: action.type,
  };
};

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([
    generateMockActivity(),
    generateMockActivity(),
    generateMockActivity(),
  ]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActivities((prev) => [generateMockActivity(), ...prev.slice(0, 2)]);
        setIsAnimating(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "lab":
        return Zap;
      case "achievement":
        return Trophy;
      case "milestone":
        return Shield;
      default:
        return Activity;
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
        <span className="text-sm font-medium text-foreground">Live Activity</span>
        <span className="text-xs text-muted-foreground ml-auto">Global Feed</span>
      </div>
      <div className="divide-y divide-border">
        {activities.map((activity, index) => {
          const Icon = getIcon(activity.type);
          return (
            <div
              key={activity.id}
              className={cn(
                "px-4 py-3 flex items-center gap-3 transition-all duration-300",
                index === 0 && isAnimating && "opacity-0 -translate-y-2"
              )}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                  activity.type === "lab" && "bg-accent/10",
                  activity.type === "achievement" && "bg-yellow-500/10",
                  activity.type === "milestone" && "bg-primary/10",
                  activity.type === "completion" && "bg-accent/10"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    activity.type === "lab" && "text-accent",
                    activity.type === "achievement" && "text-yellow-500",
                    activity.type === "milestone" && "text-primary",
                    activity.type === "completion" && "text-accent"
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">
                  <span className="font-medium">{activity.user}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>
                </p>
                {activity.course && (
                  <p className="text-xs text-muted-foreground truncate">
                    in {activity.course}
                  </p>
                )}
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                just now
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
