import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Home, Navigation, WifiOff, Bluetooth, MapPin } from 'lucide-react';
import { useLocationContext, LocationContext } from '@/hooks/useLocationContext';
import { toast } from 'sonner';

interface LocationContextIndicatorProps {
  homeWifiSSID?: string;
  onContextChange?: (context: LocationContext) => void;
}

export const LocationContextIndicator = ({ 
  homeWifiSSID, 
  onContextChange 
}: LocationContextIndicatorProps) => {
  const { 
    locationData, 
    isTracking, 
    error, 
    startTracking, 
    stopTracking 
  } = useLocationContext(homeWifiSSID);

  useEffect(() => {
    if (onContextChange && locationData.context !== 'unknown') {
      onContextChange(locationData.context);
    }
  }, [locationData.context, onContextChange]);

  useEffect(() => {
    if (error) {
      toast.error('Location tracking error', {
        description: error,
      });
    }
  }, [error]);

  const getContextIcon = () => {
    if (locationData.isAtHome) return <Home className="w-4 h-4" />;
    if (locationData.context === 'indoor') return <Home className="w-4 h-4" />;
    if (locationData.context === 'outdoor') return <Navigation className="w-4 h-4" />;
    return <MapPin className="w-4 h-4" />;
  };

  const getContextColor = () => {
    if (locationData.context === 'indoor') return 'secondary';
    if (locationData.context === 'outdoor') return 'default';
    return 'outline';
  };

  const getContextLabel = () => {
    if (locationData.isAtHome) return 'At Home';
    if (locationData.context === 'indoor') return 'Indoors';
    if (locationData.context === 'outdoor') return 'Outdoors';
    return 'Detecting...';
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Location Context
        </h3>
        <Button 
          variant={isTracking ? 'destructive' : 'default'}
          size="sm"
          onClick={isTracking ? stopTracking : startTracking}
        >
          {isTracking ? 'Stop Tracking' : 'Start Tracking'}
        </Button>
      </div>

      {isTracking && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant={getContextColor()} className="flex items-center gap-1">
              {getContextIcon()}
              {getContextLabel()}
            </Badge>
            {locationData.confidence > 0 && (
              <span className="text-sm text-muted-foreground">
                {locationData.confidence}% confidence
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              {locationData.connectedWifi ? (
                <>
                  <WifiOff className="w-4 h-4 text-primary" />
                  <span>WiFi Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">No WiFi</span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Bluetooth className="w-4 h-4" />
              <span>{locationData.nearbyBluetoothDevices} BT devices</span>
            </div>
          </div>

          {locationData.lastUpdated && (
            <p className="text-xs text-muted-foreground">
              Last updated: {locationData.lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {!isTracking && !error && (
        <p className="text-sm text-muted-foreground">
          Start tracking to detect whether you're indoors or outdoors using WiFi and Bluetooth signals.
        </p>
      )}
    </Card>
  );
};
