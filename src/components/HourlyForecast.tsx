import { Cloud, Sun, CloudRain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HourlyData {
  time: string;
  temperature: number;
  condition: "sunny" | "rainy" | "cloudy";
  precipitation: number;
}

interface HourlyForecastProps {
  data: HourlyData[];
}

const weatherIcons = {
  sunny: Sun,
  rainy: CloudRain,
  cloudy: Cloud,
};

export function HourlyForecast({ data }: HourlyForecastProps) {
  // Ensure the first item shows current time if available
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  
  // Sort data to ensure current hour comes first
  const sortedData = [...data].sort((a, b) => {
    const aHour = parseInt(a.time.split(':')[0]);
    const bHour = parseInt(b.time.split(':')[0]);
    
    // If we find current hour, prioritize it
    if (aHour === currentHour) return -1;
    if (bHour === currentHour) return 1;
    
    return aHour - bHour;
  });

  return (
    <Card className="glass-card p-6">
      <h3 className="font-semibold text-card-foreground mb-4">24-Hour Forecast</h3>
      <ScrollArea className="w-full max-w-full">
        <div className="flex gap-4 pb-4 min-w-max">
          {sortedData.map((hour, index) => {
            const WeatherIcon = weatherIcons[hour.condition];
            const isCurrentHour = index === 0;
            
            return (
              <div 
                key={index} 
                className={`flex flex-col items-center min-w-16 p-3 rounded-lg transition-colors ${
                  isCurrentHour 
                    ? 'bg-primary/20 border border-primary/30' 
                    : 'bg-secondary/50 hover:bg-secondary/70'
                }`}
              >
                <span className={`text-xs mb-2 ${isCurrentHour ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {isCurrentHour ? 'Now' : hour.time}
                </span>
                <WeatherIcon className="w-5 h-5 text-primary mb-2" />
                <span className="font-semibold text-sm text-card-foreground mb-1">{hour.temperature}°</span>
                {hour.precipitation > 0 && (
                  <span className="text-xs text-primary">{hour.precipitation}%</span>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}