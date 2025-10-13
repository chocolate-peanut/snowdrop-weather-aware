import { useState, useEffect } from 'react';
import { Network } from '@capacitor/network';
import { Geolocation } from '@capacitor/geolocation';
import { BleClient } from '@capacitor-community/bluetooth-le';

export type LocationContext = 'indoor' | 'outdoor' | 'unknown';

interface LocationContextData {
  context: LocationContext;
  confidence: number;
  isAtHome: boolean;
  connectedWifi: string | null;
  nearbyBluetoothDevices: number;
  lastUpdated: Date | null;
}

export const useLocationContext = (homeWifiSSID?: string) => {
  const [locationData, setLocationData] = useState<LocationContextData>({
    context: 'unknown',
    confidence: 0,
    isAtHome: false,
    connectedWifi: null,
    nearbyBluetoothDevices: 0,
    lastUpdated: null,
  });

  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectLocationContext = async (): Promise<LocationContext> => {
    try {
      // Check WiFi connection
      const networkStatus = await Network.getStatus();
      const connectedWifi = networkStatus.connectionType === 'wifi' ? 'Connected' : null;
      
      // Check if at home (if home WiFi is configured)
      const isAtHome = homeWifiSSID ? connectedWifi !== null : false;

      // Scan for nearby Bluetooth devices
      let nearbyDevices = 0;
      try {
        await BleClient.initialize();
        const devices = await BleClient.requestLEScan({}, (result) => {
          nearbyDevices++;
        });
        
        // Stop scan after 3 seconds
        setTimeout(async () => {
          await BleClient.stopLEScan();
        }, 3000);
      } catch (bleError) {
        console.warn('Bluetooth scan failed:', bleError);
      }

      // Get GPS location for movement detection
      let isMoving = false;
      try {
        const position = await Geolocation.getCurrentPosition();
        // Check if user is moving based on speed (if available)
        // Speed > 1 m/s (~3.6 km/h) suggests outdoor movement
        isMoving = false; // Simplified - would need multiple readings to detect movement
      } catch (gpsError) {
        console.warn('GPS check failed:', gpsError);
      }

      // Determine context based on signals
      let context: LocationContext = 'unknown';
      let confidence = 0;

      if (isAtHome && connectedWifi) {
        context = 'indoor';
        confidence = 90;
      } else if (connectedWifi && nearbyDevices > 3) {
        // Connected to WiFi with multiple BT devices = likely indoor public space
        context = 'indoor';
        confidence = 70;
      } else if (!connectedWifi && nearbyDevices < 2) {
        // No WiFi and few BT devices = likely outdoor
        context = 'outdoor';
        confidence = 75;
      } else if (isMoving) {
        context = 'outdoor';
        confidence = 80;
      }

      setLocationData({
        context,
        confidence,
        isAtHome,
        connectedWifi,
        nearbyBluetoothDevices: nearbyDevices,
        lastUpdated: new Date(),
      });

      return context;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Detection failed');
      return 'unknown';
    }
  };

  const startTracking = () => {
    setIsTracking(true);
    setError(null);

    // Initial detection
    detectLocationContext();

    // Listen to network changes
    Network.addListener('networkStatusChange', async (status) => {
      console.log('Network status changed:', status);
      await detectLocationContext();
    });

    // Periodic detection every 5 minutes
    const interval = setInterval(() => {
      detectLocationContext();
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      Network.removeAllListeners();
    };
  };

  const stopTracking = () => {
    setIsTracking(false);
    Network.removeAllListeners();
  };

  useEffect(() => {
    // Request permissions on mount
    const requestPermissions = async () => {
      try {
        // Request location permission
        await Geolocation.requestPermissions();
        
        // Initialize Bluetooth
        await BleClient.initialize();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Permission denied');
      }
    };

    requestPermissions();
  }, []);

  return {
    locationData,
    isTracking,
    error,
    startTracking,
    stopTracking,
    detectLocationContext,
  };
};
