import { useState, useEffect } from "react";
import { WeatherCard } from "@/components/WeatherCard";
import { AirQualityCard } from "@/components/AirQualityCard";
import { UVIndexCard } from "@/components/UVIndexCard";
import { HourlyForecast } from "@/components/HourlyForecast";
import { WeeklyForecast } from "@/components/WeeklyForecast";
import { NotificationBanner } from "@/components/NotificationBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Settings, Home, Calendar, FileText } from "lucide-react";

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState("New York");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

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

  const handleLocationSearch = async (query: string) => {
    setSearchLocation(query);
    if (query.length > 2) {
      // Mock search suggestions - in real app, use Google Places API
      const mockSuggestions = [
        "New York, NY, USA",
        "London, UK",
        "Paris, France",
        "Tokyo, Japan",
        "Sydney, Australia"
      ].filter(city => city.toLowerCase().includes(query.toLowerCase()));
      setSearchSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation.split(',')[0]);
    setSearchLocation("");
    setShowSuggestions(false);
  };

  const handleCurrentLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Mock reverse geocoding - in real app, use Google Geocoding API
          setLocation("Current Location");
          console.log("Location detected:", latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Please enable location services to use this feature");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
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
            onChange={(e) => handleLocationSearch(e.target.value)}
            onFocus={() => searchLocation.length > 2 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10 glass-card border-0"
          />
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50">
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 hover:bg-secondary/50 first:rounded-t-lg last:rounded-b-lg"
                  onClick={() => handleLocationSelect(suggestion)}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-card-foreground">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
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
          <Button 
            onClick={handleCurrentLocationClick}
            className="glass-card border-0 bg-primary/90 hover:bg-primary text-primary-foreground"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Use Current Location
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Enable location access for personalized weather alerts
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-3">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                activeTab === "home" ? "text-primary bg-primary/10" : "text-muted-foreground"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs font-medium">Home</span>
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                activeTab === "calendar" ? "text-primary bg-primary/10" : "text-muted-foreground"
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-xs font-medium">Calendar</span>
            </button>
            <button
              onClick={() => setActiveTab("planner")}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                activeTab === "planner" ? "text-primary bg-primary/10" : "text-muted-foreground"
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-xs font-medium">Planner</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
