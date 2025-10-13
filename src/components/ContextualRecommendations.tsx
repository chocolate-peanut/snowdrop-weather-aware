import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Navigation, 
  Umbrella, 
  Sun, 
  Wind, 
  Snowflake,
  Coffee,
  Footprints
} from 'lucide-react';
import { LocationContext } from '@/hooks/useLocationContext';

interface ContextualRecommendationsProps {
  locationContext: LocationContext;
  weatherCondition: string;
  temperature: number;
}

export const ContextualRecommendations = ({
  locationContext,
  weatherCondition,
  temperature,
}: ContextualRecommendationsProps) => {
  const getRecommendations = () => {
    const recommendations: Array<{
      icon: React.ReactNode;
      title: string;
      description: string;
    }> = [];

    if (locationContext === 'indoor') {
      // Indoor recommendations
      if (weatherCondition.includes('rain') || weatherCondition.includes('storm')) {
        recommendations.push({
          icon: <Coffee className="w-5 h-5" />,
          title: 'Perfect indoor weather',
          description: 'Great day to stay cozy inside with a warm drink',
        });
      }
      
      if (temperature < 15) {
        recommendations.push({
          icon: <Home className="w-5 h-5" />,
          title: 'Stay warm indoors',
          description: "It's cold outside. Consider staying in or dress warmly if you need to go out",
        });
      }

      if (weatherCondition.includes('snow')) {
        recommendations.push({
          icon: <Snowflake className="w-5 h-5" />,
          title: 'Snowy conditions',
          description: 'Roads may be slippery. Plan accordingly if you need to travel',
        });
      }
    } else if (locationContext === 'outdoor') {
      // Outdoor recommendations
      if (weatherCondition.includes('rain')) {
        recommendations.push({
          icon: <Umbrella className="w-5 h-5" />,
          title: 'Bring an umbrella',
          description: "You're outdoors and it's rainy. Find shelter or use rain protection",
        });
      }

      if (weatherCondition.includes('sunny') && temperature > 28) {
        recommendations.push({
          icon: <Sun className="w-5 h-5" />,
          title: 'Stay hydrated',
          description: "It's hot outside. Drink plenty of water and find shade when possible",
        });
      }

      if (weatherCondition.includes('wind')) {
        recommendations.push({
          icon: <Wind className="w-5 h-5" />,
          title: 'Windy conditions',
          description: 'Strong winds detected. Secure loose items and be cautious',
        });
      }

      if (temperature < 10) {
        recommendations.push({
          icon: <Footprints className="w-5 h-5" />,
          title: 'Bundle up',
          description: "You're outside in cold weather. Consider finding a warm place soon",
        });
      }

      if (weatherCondition.includes('storm') || weatherCondition.includes('thunder')) {
        recommendations.push({
          icon: <Home className="w-5 h-5" />,
          title: 'Seek shelter',
          description: 'Severe weather detected. Find indoor shelter immediately',
        });
      }
    }

    // Default recommendations if none match
    if (recommendations.length === 0) {
      recommendations.push({
        icon: <Navigation className="w-5 h-5" />,
        title: 'Weather looks good',
        description: 'Enjoy your day!',
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  if (locationContext === 'unknown') {
    return null;
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          {locationContext === 'indoor' ? (
            <Home className="w-5 h-5" />
          ) : (
            <Navigation className="w-5 h-5" />
          )}
          Contextual Recommendations
        </h3>
        <Badge variant={locationContext === 'indoor' ? 'secondary' : 'default'}>
          {locationContext === 'indoor' ? 'Indoors' : 'Outdoors'}
        </Badge>
      </div>

      <div className="space-y-2">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className="flex gap-3 p-3 rounded-lg bg-accent/50 border border-border"
          >
            <div className="flex-shrink-0 mt-0.5 text-primary">
              {rec.icon}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{rec.title}</p>
              <p className="text-xs text-muted-foreground">{rec.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
