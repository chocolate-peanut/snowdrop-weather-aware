import { Cloud, Sun, CloudRain, Snowflake, Wind, Zap, Eye, Thermometer } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DailyData {
  day: string;
  condition: "sunny" | "rainy" | "cloudy" | "snow" | "wind" | "thunderstorms" | "lightning" | "fog" | "extreme-heat";
  high: number;
  low: number;
  precipitation: number;
}

interface WeeklyForecastProps {
  data: DailyData[];
}

const weatherIcons = {
  sunny: Sun,
  rainy: CloudRain,
  cloudy: Cloud,
  snow: Snowflake,
  wind: Wind,
  thunderstorms: Zap,
  lightning: Zap,
  fog: Eye,
  "extreme-heat": Thermometer,
};

export function WeeklyForecast({ data }: WeeklyForecastProps) {
  return (
    <Card className="glass-card p-6">
      <h3 className="font-semibold text-card-foreground mb-4">7-Day Forecast</h3>
      <div className="space-y-3">
        {data.map((day, index) => {
          const WeatherIcon = weatherIcons[day.condition];
          return (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="font-medium text-card-foreground min-w-12">{day.day}</span>
                <WeatherIcon className="w-5 h-5 text-primary" />
                {day.precipitation > 0 && (
                  <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {day.precipitation}%
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-card-foreground">{day.high}°</span>
                <span className="text-muted-foreground">{day.low}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}