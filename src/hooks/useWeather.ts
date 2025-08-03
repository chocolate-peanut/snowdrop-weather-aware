import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CurrentWeather {
  location: string;
  temperature: number;
  condition: "sunny" | "rainy" | "cloudy" | "rain" | "snow" | "wind" | "thunderstorms" | "lightning" | "fog" | "extreme-heat";
  description: string;
  date: string;
  time: string;
}

interface HourlyData {
  time: string;
  temperature: number;
  condition: "sunny" | "rainy" | "cloudy" | "rain" | "snow" | "wind" | "thunderstorms" | "lightning" | "fog" | "extreme-heat";
  precipitation: number;
}

interface DailyData {
  day: string;
  condition: "sunny" | "rainy" | "cloudy" | "rain" | "snow" | "wind" | "thunderstorms" | "lightning" | "fog" | "extreme-heat";
  high: number;
  low: number;
  precipitation: number;
}

interface AirQuality {
  aqi: number;
  pm25: number;
  pm10: number;
}

interface UVIndex {
  current: number;
  peak: string;
}

interface WeatherAlert {
  headline: string;
  severity: string;
  description: string;
  expires: string;
}

interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyData[];
  weekly: DailyData[];
  airQuality: AirQuality;
  uvIndex: UVIndex;
  alerts: WeatherAlert[];
}

interface LocationSuggestion {
  id: number;
  name: string;
  region: string;
  country: string;
  fullName: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

export function useWeather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);

  const searchLocations = async (query: string): Promise<LocationSuggestion[]> => {
    if (query.trim().length < 2) {
      setLocationSuggestions([]);
      return [];
    }

    try {
      const { data, error } = await supabase.functions.invoke('location-search', {
        body: { query: query.trim() }
      });

      if (error) {
        console.error('Location search error:', error);
        return [];
      }

      const suggestions = data.suggestions || [];
      setLocationSuggestions(suggestions);
      return suggestions;
    } catch (err) {
      console.error('Location search failed:', err);
      return [];
    }
  };

  const fetchWeatherByCoordinates = async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('weather', {
        body: { latitude, longitude }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setWeatherData(data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = async (location: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('weather', {
        body: { location }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setWeatherData(data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          let errorMessage = 'Failed to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timeout';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  const fetchCurrentLocationWeather = async () => {
    try {
      const coords = await getCurrentLocation();
      await fetchWeatherByCoordinates(coords.latitude, coords.longitude);
    } catch (err) {
      console.error('Error getting current location weather:', err);
      setError(err instanceof Error ? err.message : 'Failed to get current location');
    }
  };

  return {
    weatherData,
    loading,
    error,
    locationSuggestions,
    searchLocations,
    fetchWeatherByCoordinates,
    fetchWeatherByLocation,
    fetchCurrentLocationWeather,
    clearError: () => setError(null)
  };
}