import { AlertTriangle, Umbrella, Sun, Shield, Zap, Snowflake, Wind, Thermometer, Flame, Eye, Mountain, Waves } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface NotificationBannerProps {
  type: "rain" | "uv" | "air" | "general" | "storm" | "snow" | "earthquake" | "flood" | "tornado" | "hurricane" | "fire" | "fog" | "wind" | "heat" | "cold";
  message: string;
  action?: string;
  severity?: "minor" | "moderate" | "severe" | "extreme";
  playSound?: boolean;
}

const notificationConfig = {
  rain: {
    icon: Umbrella,
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    iconColor: "text-blue-600"
  },
  uv: {
    icon: Sun,
    bgColor: "bg-yellow-500/10", 
    borderColor: "border-yellow-500/20",
    iconColor: "text-yellow-600"
  },
  air: {
    icon: Shield,
    bgColor: "bg-air-poor/10",
    borderColor: "border-air-poor/20", 
    iconColor: "text-air-poor"
  },
  general: {
    icon: AlertTriangle,
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    iconColor: "text-orange-600"
  },
  storm: {
    icon: Zap,
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    iconColor: "text-purple-600"
  },
  snow: {
    icon: Snowflake,
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    iconColor: "text-cyan-600"
  },
  earthquake: {
    icon: Mountain,
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    iconColor: "text-red-600"
  },
  flood: {
    icon: Waves,
    bgColor: "bg-blue-600/10",
    borderColor: "border-blue-600/20",
    iconColor: "text-blue-700"
  },
  tornado: {
    icon: Wind,
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/20",
    iconColor: "text-gray-600"
  },
  hurricane: {
    icon: Wind,
    bgColor: "bg-red-600/10",
    borderColor: "border-red-600/20",
    iconColor: "text-red-700"
  },
  fire: {
    icon: Flame,
    bgColor: "bg-orange-600/10",
    borderColor: "border-orange-600/20",
    iconColor: "text-orange-700"
  },
  fog: {
    icon: Eye,
    bgColor: "bg-gray-400/10",
    borderColor: "border-gray-400/20",
    iconColor: "text-gray-500"
  },
  wind: {
    icon: Wind,
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    iconColor: "text-emerald-600"
  },
  heat: {
    icon: Thermometer,
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    iconColor: "text-red-600"
  },
  cold: {
    icon: Thermometer,
    bgColor: "bg-blue-700/10",
    borderColor: "border-blue-700/20",
    iconColor: "text-blue-800"
  }
};

const playAlertSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Create a simple notification sound
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
};

export function NotificationBanner({ type, message, action, severity = "moderate", playSound = false }: NotificationBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  
  useEffect(() => {
    if (playSound && !dismissed) {
      try {
        playAlertSound();
      } catch (error) {
        console.warn("Could not play notification sound:", error);
      }
    }
  }, [playSound, dismissed]);
  
  if (dismissed) return null;
  
  const config = notificationConfig[type];
  const Icon = config.icon;
  
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "extreme":
        return "border-red-500/40 bg-red-500/20 animate-pulse";
      case "severe":
        return "border-orange-500/40 bg-orange-500/20";
      case "moderate":
        return "";
      case "minor":
        return "opacity-80";
      default:
        return "";
    }
  };

  return (
    <Alert className={`${config.bgColor} ${config.borderColor} border animate-slide-up cursor-default ${getSeverityStyles(severity)}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.iconColor} mt-0.5 ${severity === "extreme" ? "animate-bounce" : ""}`} />
        <div className="flex-1">
          <AlertDescription className="text-card-foreground">
            {severity === "extreme" && <span className="font-semibold text-red-600">URGENT: </span>}
            {severity === "severe" && <span className="font-semibold text-orange-600">WARNING: </span>}
            {message}
            {action && (
              <Button variant="link" className="p-0 h-auto ml-2 text-primary font-medium">
                {action}
              </Button>
            )}
          </AlertDescription>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-auto p-0"
          onClick={() => setDismissed(true)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Alert>
  );
}