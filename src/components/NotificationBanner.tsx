import { AlertTriangle, Umbrella, Sun, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";

interface NotificationBannerProps {
  type: "rain" | "uv" | "air" | "general";
  message: string;
  action?: string;
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
  }
};

export function NotificationBanner({ type, message, action }: NotificationBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  
  if (dismissed) return null;
  
  const config = notificationConfig[type];
  const Icon = config.icon;

  return (
    <Alert className={`${config.bgColor} ${config.borderColor} border animate-slide-up`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.iconColor} mt-0.5`} />
        <div className="flex-1">
          <AlertDescription className="text-card-foreground">
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