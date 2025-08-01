import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WeatherResponse {
  current: {
    temp_c: number;
    condition: {
      text: string;
      code: number;
    };
    uv: number;
    air_quality: {
      co: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      'us-epa-index': number;
    };
    humidity: number;
    wind_kph: number;
    pressure_mb: number;
    vis_km: number;
  };
  location: {
    name: string;
    region: string;
    country: string;
    localtime: string;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          text: string;
          code: number;
        };
        daily_chance_of_rain: number;
        uv: number;
      };
      hour: Array<{
        time: string;
        temp_c: number;
        condition: {
          text: string;
          code: number;
        };
        chance_of_rain: number;
      }>;
    }>;
  };
  alerts?: {
    alert: Array<{
      headline: string;
      msgtype: string;
      severity: string;
      urgency: string;
      areas: string;
      category: string;
      certainty: string;
      event: string;
      note: string;
      effective: string;
      expires: string;
      desc: string;
      instruction: string;
    }>;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude, longitude, location } = await req.json();
    
    if (!latitude && !longitude && !location) {
      return new Response(
        JSON.stringify({ error: 'Either coordinates (lat/lon) or location name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const weatherApiKey = Deno.env.get('WEATHER_API_KEY');
    if (!weatherApiKey) {
      return new Response(
        JSON.stringify({ error: 'Weather API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine query parameter
    const query = location || `${latitude},${longitude}`;
    
    // Fetch current weather and forecast
    const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${encodeURIComponent(query)}&days=7&aqi=yes&alerts=yes`;
    
    console.log('Fetching weather data for:', query);
    
    const response = await fetch(weatherUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('WeatherAPI error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Weather API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data: WeatherResponse = await response.json();
    console.log('Weather data fetched successfully');

    // Helper function to map weather condition codes to our app's conditions
    const mapWeatherCondition = (code: number): "sunny" | "rainy" | "cloudy" => {
      // WeatherAPI condition codes
      if ([1000].includes(code)) return "sunny"; // Clear/Sunny
      if ([1003, 1006, 1009].includes(code)) return "cloudy"; // Partly cloudy, Cloudy, Overcast
      if ([1063, 1066, 1069, 1072, 1087, 1114, 1117, 1135, 1147, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1240, 1243, 1246, 1249, 1252, 1255, 1258, 1261, 1264, 1273, 1276, 1279, 1282].includes(code)) return "rainy"; // Any form of precipitation
      return "cloudy"; // Default fallback
    };

    // Process hourly data (next 24 hours)
    const hourlyData = data.forecast.forecastday[0].hour
      .concat(data.forecast.forecastday[1]?.hour || [])
      .slice(0, 24)
      .map(hour => ({
        time: new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temperature: Math.round(hour.temp_c),
        condition: mapWeatherCondition(hour.condition.code),
        precipitation: hour.chance_of_rain
      }));

    // Process weekly data
    const weeklyData = data.forecast.forecastday.map(day => ({
      day: new Date(day.date).toLocaleDateString([], { weekday: 'short' }),
      condition: mapWeatherCondition(day.day.condition.code),
      high: Math.round(day.day.maxtemp_c),
      low: Math.round(day.day.mintemp_c),
      precipitation: day.day.daily_chance_of_rain
    }));

    // Process alerts
    const alerts = data.alerts?.alert.map(alert => ({
      headline: alert.headline,
      severity: alert.severity,
      description: alert.desc,
      expires: alert.expires
    })) || [];

    const result = {
      current: {
        location: `${data.location.name}, ${data.location.region}`,
        temperature: Math.round(data.current.temp_c),
        condition: mapWeatherCondition(data.current.condition.code),
        description: data.current.condition.text,
        date: new Date(data.location.localtime).toLocaleDateString(),
        time: new Date(data.location.localtime).toLocaleTimeString()
      },
      hourly: hourlyData,
      weekly: weeklyData,
      airQuality: {
        aqi: data.current.air_quality['us-epa-index'],
        pm25: Math.round(data.current.air_quality.pm2_5),
        pm10: Math.round(data.current.air_quality.pm10)
      },
      uvIndex: {
        current: Math.round(data.current.uv),
        peak: "12:00 PM" // WeatherAPI doesn't provide peak time, using standard noon
      },
      alerts
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in weather function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});