import { useState, useEffect } from "react";
import { WeatherCard } from "@/components/WeatherCard";
import { AirQualityCard } from "@/components/AirQualityCard";
import { UVIndexCard } from "@/components/UVIndexCard";
import { HourlyForecast } from "@/components/HourlyForecast";
import { WeeklyForecast } from "@/components/WeeklyForecast";
import { NotificationBanner } from "@/components/NotificationBanner";
import { Layout } from "@/components/Layout";
import { useWeather } from "@/hooks/useWeather";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchLocation, setSearchLocation] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  
  const { toast } = useToast();
  const { 
    weatherData, 
    loading, 
    error, 
    fetchWeatherByLocation, 
    fetchCurrentLocationWeather,
    clearError 
  } = useWeather();

  // Load weather for default location on mount
  useEffect(() => {
    fetchWeatherByLocation("New York");
  }, []);

  // Show error messages as toasts
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Weather Error",
        description: error,
      });
      clearError();
    }
  }, [error, toast, clearError]);

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
    const locationName = selectedLocation.split(',')[0];
    fetchWeatherByLocation(locationName);
    setSearchLocation("");
    setShowSuggestions(false);
  };

  const handleCurrentLocationClick = async () => {
    try {
      await fetchCurrentLocationWeather();
      toast({
        title: "Location Updated",
        description: "Weather data updated for your current location",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Location Error",
        description: "Failed to get current location. Please enable location services.",
      });
    }
  };

  // Use weather data if available, otherwise show loading or fallback
  const currentWeather = weatherData?.current;
  const location = currentWeather?.location || "Loading...";

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      location={location}
      searchLocation={searchLocation}
      onLocationSearch={handleLocationSearch}
      onLocationSelect={handleLocationSelect}
      onCurrentLocationClick={handleCurrentLocationClick}
      searchSuggestions={searchSuggestions}
      showSuggestions={showSuggestions}
      setShowSuggestions={setShowSuggestions}
      currentTime={currentTime}
    >
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Loading state */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading weather data...</p>
          </div>
        )}

        {/* Weather content */}
        {!loading && weatherData && (
          <>
            {/* Smart Notifications */}
            <div className="space-y-3">
              {weatherData.alerts.map((alert, index) => (
                <NotificationBanner 
                  key={index}
                  type="general" 
                  message={alert.headline}
                />
              ))}
              {weatherData.hourly.some(h => h.precipitation > 50) && (
                <NotificationBanner 
                  type="rain" 
                  message="Rain expected in the next few hours. Don't forget your umbrella!" 
                />
              )}
              {weatherData.uvIndex.current > 6 && (
                <NotificationBanner 
                  type="uv" 
                  message="High UV index today. Consider wearing sunscreen and a hat."
                />
              )}
              {weatherData.airQuality.aqi > 100 && (
                <NotificationBanner 
                  type="air" 
                  message="Air quality is unhealthy. Consider limiting outdoor activities."
                />
              )}
            </div>

            {/* Main Weather Card */}
            <WeatherCard
              location={currentWeather.location}
              temperature={currentWeather.temperature}
              condition={currentWeather.condition}
              date={formatDate(currentTime)}
              description={currentWeather.description}
            />

            {/* Air Quality and UV Index */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AirQualityCard
                aqi={weatherData.airQuality.aqi}
                location={currentWeather.location}
                pm25={weatherData.airQuality.pm25}
                pm10={weatherData.airQuality.pm10}
              />
              <UVIndexCard
                uvIndex={weatherData.uvIndex.current}
                peak={weatherData.uvIndex.peak}
              />
            </div>

            {/* Hourly Forecast */}
            <HourlyForecast data={weatherData.hourly} />

            {/* Weekly Forecast */}
            <WeeklyForecast data={weatherData.weekly} />
          </>
        )}

        {/* Location Detection Prompt */}
        <div className="text-center py-8">
          <Button 
            onClick={handleCurrentLocationClick}
            disabled={loading}
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
    </Layout>
  );
};

export default Index;