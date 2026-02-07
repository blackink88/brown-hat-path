import { Trophy, Clock, Medal, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  score: number;
  metric: string;
  avatarUrl?: string;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  title?: string;
  metricLabel?: string;
}

export function Leaderboard({
  entries,
  title = "Top Performers",
  metricLabel = "Time-to-Mitigation",
}: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1)
      return <Crown className="h-4 w-4 text-yellow-500" />;
    if (rank === 2)
      return <Medal className="h-4 w-4 text-gray-400" />;
    if (rank === 3)
      return <Medal className="h-4 w-4 text-amber-600" />;
    return null;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-yellow-500/10 border-yellow-500/30";
    if (rank === 2) return "bg-gray-500/10 border-gray-500/30";
    if (rank === 3) return "bg-amber-600/10 border-amber-600/30";
    return "bg-card border-border";
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <Trophy className="h-4 w-4 text-accent" />
        <span className="font-medium text-foreground">{title}</span>
        <span className="text-xs text-muted-foreground ml-auto">
          {metricLabel}
        </span>
      </div>
      <div className="divide-y divide-border">
        {entries.map((entry) => (
          <div
            key={entry.userId}
            className={cn(
              "flex items-center gap-3 px-4 py-3 border-l-2 transition-colors",
              getRankStyle(entry.rank)
            )}
          >
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm",
                entry.rank === 1 && "bg-yellow-500 text-yellow-950",
                entry.rank === 2 && "bg-gray-400 text-gray-950",
                entry.rank === 3 && "bg-amber-600 text-amber-950",
                entry.rank > 3 && "bg-muted text-muted-foreground"
              )}
            >
              {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {entry.displayName}
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="font-mono text-foreground">{entry.metric}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
