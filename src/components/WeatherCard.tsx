import { Cloud, Sun, CloudRain, MapPin, Calendar, Snowflake, Wind, Zap, Eye, Thermometer } from "lucide-react";
import { Card } from "@/components/ui/card";
import sunnyWeather from "@/assets/weather-sunny.jpg";
import rainyWeather from "@/assets/weather-rainy.jpg";
import cloudyWeather from "@/assets/weather-cloudy.jpg";
import snowWeather from "@/assets/weather-snow.jpg";
import windWeather from "@/assets/weather-wind.jpg";
import thunderstormsWeather from "@/assets/weather-thunderstorms.jpg";
import lightningWeather from "@/assets/weather-lightning.jpg";
import fogWeather from "@/assets/weather-fog.jpg";
import extremeHeatWeather from "@/assets/weather-extreme-heat.jpg";

interface WeatherCardProps {
  location: string;
  temperature: number;
  condition: "sunny" | "rainy" | "cloudy" | "snow" | "wind" | "thunderstorms" | "lightning" | "fog" | "extreme-heat";
  date: string;
  description: string;
}

const weatherImages = {
  sunny: sunnyWeather,
  rainy: rainyWeather,
  cloudy: cloudyWeather,
  snow: snowWeather,
  wind: windWeather,
  thunderstorms: thunderstormsWeather,
  lightning: lightningWeather,
  fog: fogWeather,
  "extreme-heat": extremeHeatWeather,
};

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

export function WeatherCard({ location, temperature, condition, date, description }: WeatherCardProps) {
  const WeatherIcon = weatherIcons[condition];
  
  return (
    <Card className="relative overflow-hidden glass-card weather-gradient border-0 p-6 animate-fade-in">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-primary-foreground/80">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-primary-foreground/80">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{date}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-6xl font-light text-primary-foreground mb-2">
              {temperature}°
            </h2>
            <p className="text-primary-foreground/90 text-lg font-medium mb-1">
              {condition.charAt(0).toUpperCase() + condition.slice(1)}
            </p>
            <p className="text-primary-foreground/70 text-sm">
              {description}
            </p>
          </div>
          
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm animate-weather-float">
              <img 
                src={weatherImages[condition]} 
                alt={`${condition} weather`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-primary/50 to-primary-glow/40" />
    </Card>
  );
}