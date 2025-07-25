import { useState, useEffect } from 'react';
import { UserSettings } from '@/types/plan';

const SETTINGS_KEY = 'snowdrop-settings';

const defaultSettings: UserSettings = {
  theme: 'system',
  notifications: true,
  locationServices: true,
  preferences: {
    books: [],
    movies: [],
    music: []
  }
};

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
  };

  const updatePreferences = (type: 'books' | 'movies' | 'music', preferences: string[]) => {
    const updatedSettings = {
      ...settings,
      preferences: {
        ...settings.preferences,
        [type]: preferences
      }
    };
    setSettings(updatedSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
  };

  return {
    settings,
    updateSettings,
    updatePreferences
  };
};