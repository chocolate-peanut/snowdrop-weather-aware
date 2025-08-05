import { Wind, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AirQualityCardProps {
  aqi: number;
  location: string;
  pm25: number;
  pm10: number;
}

export function AirQualityCard({ aqi, location, pm25, pm10 }: AirQualityCardProps) {
  const getAirQualityStatus = (aqi: number) => {
    if (aqi <= 50) return { 
      level: "Good", 
      color: "air-good", 
      icon: CheckCircle,
      description: "Air quality is excellent",
      bgColor: "bg-air-good/10"
    };
    if (aqi <= 100) return { 
      level: "Moderate", 
      color: "air-moderate", 
      icon: AlertCircle,
      description: "Air quality is acceptable",
      bgColor: "bg-air-moderate/10"
    };
    return { 
      level: "Poor", 
      color: "air-poor", 
      icon: AlertTriangle,
      description: "Air quality is unhealthy",
      bgColor: "bg-air-poor/10"
    };
  };

  const status = getAirQualityStatus(aqi);
  const StatusIcon = status.icon;

  return (
    <Card className="glass-card p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-card-foreground">Air Quality</h3>
        </div>
        <Badge variant="secondary" className={`${status.bgColor} border-0 cursor-default`}>
          <StatusIcon className={`w-3 h-3 mr-1 text-${status.color}`} />
          <span className={`text-${status.color} font-medium`}>{status.level}</span>
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <div className={`text-4xl font-bold mb-2 text-${status.color}`}>
            {aqi}
          </div>
          <p className="text-sm text-muted-foreground">{status.description}</p>
        </div>

        <TooltipProvider>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
            <div className="text-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <p className="text-xs text-muted-foreground mb-1">PM2.5</p>
                    <p className="text-sm font-semibold text-card-foreground">{pm25} μg/m³</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="max-w-xs">
                    <p className="font-medium mb-1">Fine Particulate Matter (PM2.5)</p>
                    <p className="text-xs">Particles smaller than 2.5 micrometers. Can penetrate deep into lungs and bloodstream.</p>
                    <p className="text-xs mt-1">
                      <span className="font-medium">WHO Guidelines:</span><br/>
                      • Good: 0-10 μg/m³<br/>
                      • Moderate: 10-25 μg/m³<br/>
                      • Poor: {'>'}25 μg/m³
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="text-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <p className="text-xs text-muted-foreground mb-1">PM10</p>
                    <p className="text-sm font-semibold text-card-foreground">{pm10} μg/m³</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="max-w-xs">
                    <p className="font-medium mb-1">Coarse Particulate Matter (PM10)</p>
                    <p className="text-xs">Particles smaller than 10 micrometers. Can irritate eyes, nose, and throat.</p>
                    <p className="text-xs mt-1">
                      <span className="font-medium">WHO Guidelines:</span><br/>
                      • Good: 0-20 μg/m³<br/>
                      • Moderate: 20-50 μg/m³<br/>
                      • Poor: {'>'}50 μg/m³
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </TooltipProvider>
      </div>
    </Card>
  );
}