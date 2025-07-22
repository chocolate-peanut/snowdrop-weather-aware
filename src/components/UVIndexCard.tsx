import { Sun, Shield, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UVIndexCardProps {
  uvIndex: number;
  peak: string;
}

export function UVIndexCard({ uvIndex, peak }: UVIndexCardProps) {
  const getUVStatus = (uv: number) => {
    if (uv <= 2) return { 
      level: "Low", 
      color: "uv-low", 
      icon: Sun,
      description: "No protection needed",
      bgColor: "bg-uv-low/10"
    };
    if (uv <= 5) return { 
      level: "Moderate", 
      color: "uv-moderate", 
      icon: Shield,
      description: "Some protection required",
      bgColor: "bg-uv-moderate/10"
    };
    if (uv <= 7) return { 
      level: "High", 
      color: "uv-high", 
      icon: AlertTriangle,
      description: "Protection essential",
      bgColor: "bg-uv-high/10"
    };
    return { 
      level: "Very High", 
      color: "uv-very-high", 
      icon: AlertTriangle,
      description: "Avoid sun exposure",
      bgColor: "bg-uv-very-high/10"
    };
  };

  const status = getUVStatus(uvIndex);
  const StatusIcon = status.icon;

  return (
    <Card className="glass-card p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-card-foreground">UV Index</h3>
        </div>
        <Badge variant="secondary" className={`${status.bgColor} border-0`}>
          <StatusIcon className={`w-3 h-3 mr-1 text-${status.color}`} />
          <span className={`text-${status.color} font-medium`}>{status.level}</span>
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <div className={`text-4xl font-bold mb-2 text-${status.color}`}>
            {uvIndex}
          </div>
          <p className="text-sm text-muted-foreground">{status.description}</p>
        </div>

        <div className="pt-4 border-t border-border/50">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Peak time</span>
            <span className="text-sm font-semibold text-card-foreground">{peak}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}