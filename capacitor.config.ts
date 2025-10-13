import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c06bcff2eb6d4d29940512e3a646f0ac',
  appName: 'snowdrop-weather-aware',
  webDir: 'dist',
  server: {
    url: 'https://c06bcff2-eb6d-4d29-9405-12e3a646f0ac.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
