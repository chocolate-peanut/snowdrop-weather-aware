import { useState, useEffect } from "react";
import { WeatherCard } from "@/components/WeatherCard";
import { AirQualityCard } from "@/components/AirQualityCard";
import { UVIndexCard } from "@/components/UVIndexCard";
import { HourlyForecast } from "@/components/HourlyForecast";
import { WeeklyForecast } from "@/components/WeeklyForecast";
import { NotificationBanner } from "@/components/NotificationBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Menu, Settings } from "lucide-react";

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState("New York");
  const [searchLocation, setSearchLocation] = useState("");

  // Sample data - in a real app, this would come from weather APIs
  const mockHourlyData = [
    { time: "Now", temperature: 22, condition: "sunny" as const, precipitation: 0 },
    { time: "1PM", temperature: 24, condition: "sunny" as const, precipitation: 0 },
    { time: "2PM", temperature: 25, condition: "cloudy" as const, precipitation: 10 },
    { time: "3PM", temperature: 23, condition: "rainy" as const, precipitation: 80 },
    { time: "4PM", temperature: 21, condition: "rainy" as const, precipitation: 90 },
    { time: "5PM", temperature: 20, condition: "cloudy" as const, precipitation: 30 },
    { time: "6PM", temperature: 19, condition: "cloudy" as const, precipitation: 0 },
    { time: "7PM", temperature: 18, condition: "sunny" as const, precipitation: 0 },
  ];

  const mockWeeklyData = [
    { day: "Today", condition: "sunny" as const, high: 25, low: 18, precipitation: 0 },
    { day: "Mon", condition: "rainy" as const, high: 22, low: 16, precipitation: 85 },
    { day: "Tue", condition: "cloudy" as const, high: 20, low: 14, precipitation: 20 },
    { day: "Wed", condition: "sunny" as const, high: 24, low: 17, precipitation: 0 },
    { day: "Thu", condition: "sunny" as const, high: 26, low: 19, precipitation: 0 },
    { day: "Fri", condition: "cloudy" as const, high: 23, low: 16, precipitation: 15 },
    { day: "Sat", condition: "rainy" as const, high: 19, low: 13, precipitation: 70 },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">SnowDrop</h1>
              <p className="text-sm text-muted-foreground">{formatTime(currentTime)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Smart Notifications */}
        <div className="space-y-3">
          <NotificationBanner 
            type="rain" 
            message="Rain expected in 2 hours. Don't forget your umbrella!" 
            action="Set reminder"
          />
          <NotificationBanner 
            type="uv" 
            message="High UV index today. Consider wearing sunscreen and a hat."
            action="View details"
          />
        </div>

        {/* Location Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search location..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="pl-10 glass-card border-0"
          />
        </div>

        {/* Main Weather Card */}
        <WeatherCard
          location={location}
          temperature={22}
          condition="sunny"
          date={formatDate(currentTime)}
          description="Clear skies with gentle breeze"
        />

        {/* Air Quality and UV Index */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AirQualityCard
            aqi={42}
            location={location}
            pm25={12}
            pm10={18}
          />
          <UVIndexCard
            uvIndex={6}
            peak="12:00 - 14:00"
          />
        </div>

        {/* Hourly Forecast */}
        <HourlyForecast data={mockHourlyData} />

        {/* Weekly Forecast */}
        <WeeklyForecast data={mockWeeklyData} />

        {/* Location Detection Prompt */}
        <div className="text-center py-8">
          <Button className="glass-card border-0 bg-primary/90 hover:bg-primary text-primary-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            Use Current Location
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Enable location access for personalized weather alerts
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
