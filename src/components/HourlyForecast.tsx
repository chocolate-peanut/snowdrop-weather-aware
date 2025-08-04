import { Cloud, Sun, CloudRain, Snowflake, Wind, Zap, Eye, Thermometer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HourlyData {
  time: string;
  temperature: number;
  condition: "sunny" | "rainy" | "cloudy" | "snow" | "wind" | "thunderstorms" | "lightning" | "fog" | "extreme-heat";
  precipitation: number;
}

interface HourlyForecastProps {
  data: HourlyData[];
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

export function HourlyForecast({ data }: HourlyForecastProps) {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  
  // Create chronological hourly data starting from current hour
  const createChronologicalData = () => {
    const chronologicalData = [];
    
    for (let i = 0; i < 24; i++) {
      const targetHour = (currentHour + i) % 24;
      const isCurrentHour = i === 0;
      
      // Find matching data point or create default
      const matchingData = data.find(item => {
        const itemHour = parseInt(item.time.split(':')[0]);
        const adjustedHour = item.time.includes('PM') && itemHour !== 12 
          ? itemHour + 12 
          : item.time.includes('AM') && itemHour === 12 
          ? 0 
          : itemHour;
        return adjustedHour === targetHour;
      });
      
      const displayTime = isCurrentHour 
        ? 'Now'
        : targetHour === 0 
        ? '12 AM'
        : targetHour === 12 
        ? '12 PM'
        : targetHour > 12 
        ? `${targetHour - 12} PM`
        : `${targetHour} AM`;
      
      chronologicalData.push({
        time: displayTime,
        temperature: matchingData?.temperature || 20,
        condition: matchingData?.condition || 'cloudy',
        precipitation: matchingData?.precipitation || 0,
        isCurrentHour
      });
    }
    
    return chronologicalData;
  };
  
  const chronologicalData = createChronologicalData();

  return (
    <Card className="glass-card p-6">
      <h3 className="font-semibold text-card-foreground mb-4">24-Hour Forecast</h3>
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-4 overflow-x-auto min-w-max">
          {chronologicalData.map((hour, index) => {
            const WeatherIcon = weatherIcons[hour.condition];
            
            return (
              <div 
                key={index} 
                className={`flex flex-col items-center w-20 flex-shrink-0 p-3 rounded-lg transition-colors ${
                  hour.isCurrentHour 
                    ? 'bg-primary/20 border border-primary/30' 
                    : 'bg-secondary/50 hover:bg-secondary/70'
                }`}
              >
                <span className={`text-xs mb-2 whitespace-nowrap ${hour.isCurrentHour ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {hour.time}
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