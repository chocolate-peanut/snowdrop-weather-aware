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
  return (
    <Card className="glass-card p-6">
      <h3 className="font-semibold text-card-foreground mb-4">24-Hour Forecast</h3>
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-2">
          {data.map((hour, index) => {
            const WeatherIcon = weatherIcons[hour.condition];
            return (
              <div 
                key={index} 
                className="flex flex-col items-center min-w-16 p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
              >
                <span className="text-xs text-muted-foreground mb-2">{hour.time}</span>
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