import { useState, useEffect } from "react";
import { WeatherCard } from "@/components/WeatherCard";
import { AirQualityCard } from "@/components/AirQualityCard";
import { UVIndexCard } from "@/components/UVIndexCard";
import { HourlyForecast } from "@/components/HourlyForecast";
import { WeeklyForecast } from "@/components/WeeklyForecast";
import { NotificationBanner } from "@/components/NotificationBanner";
import { mapAlertToNotificationType } from "@/utils/alertTypeMapper";
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
    locationSuggestions,
    searchLocations,
    fetchWeatherByLocation, 
    fetchCurrentLocationWeather,
    clearError 
  } = useWeather();

  // Load weather on mount - check for saved location first
  useEffect(() => {
    const savedLocation = localStorage.getItem('weather-location');
    if (savedLocation) {
      fetchWeatherByLocation(savedLocation);
    } else {
      // No saved location, try to get current location
      fetchCurrentLocationWeather();
    }
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
    if (query.trim().length >= 2) {
      const suggestions = await searchLocations(query);
      setSearchSuggestions(suggestions.map(s => s.fullName));
      setShowSuggestions(suggestions.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleLocationSelect = (selectedLocation: string) => {
    // This function is now for handling direct search
    if (selectedLocation.trim()) {
      const location = selectedLocation.trim();
      fetchWeatherByLocation(location);
      localStorage.setItem('weather-location', location);
      setSearchLocation("");
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchLocation.trim()) {
      const location = searchLocation.trim();
      fetchWeatherByLocation(location);
      localStorage.setItem('weather-location', location);
      setSearchLocation("");
      setShowSuggestions(false);
    }
  };

  const handleCurrentLocationClick = async () => {
    try {
      await fetchCurrentLocationWeather();
      // Clear saved location when using current location
      localStorage.removeItem('weather-location');
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
              {weatherData.alerts.map((alert, index) => {
                const { type, severity } = mapAlertToNotificationType(alert.headline, alert.severity);
                return (
                  <NotificationBanner 
                    key={index}
                    type={type}
                    severity={severity}
                    message={alert.headline}
                    playSound={severity === "extreme" || severity === "severe"}
                  />
                );
              })}
              {weatherData.hourly.some(h => h.precipitation > 50) && (
                <NotificationBanner 
                  type="rain" 
                  severity="moderate"
                  message="Rain expected in the next few hours. Don't forget your umbrella!" 
                  playSound={true}
                />
              )}
              {weatherData.uvIndex.current > 6 && (
                <NotificationBanner 
                  type="uv" 
                  severity="moderate"
                  message="High UV index today. Consider wearing sunscreen and a hat."
                />
              )}
              {weatherData.airQuality.aqi > 100 && (
                <NotificationBanner 
                  type="air" 
                  severity="moderate"
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