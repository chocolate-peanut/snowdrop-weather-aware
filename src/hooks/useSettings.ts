import { useState, useEffect } from 'react';
import { UserSettings } from '@/types/plan';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

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
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // If no user, try to migrate from localStorage
        await migrateFromLocalStorage();
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching settings:', error);
        toast({
          title: "Error",
          description: "Failed to load settings. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setSettings({
          theme: data.theme,
          notifications: data.notifications,
          locationServices: data.location_services,
          preferences: data.preferences
        });
      } else {
        // Create default settings for new user
        await createDefaultSettings(user.id);
      }
    } catch (error) {
      console.error('Error in fetchSettings:', error);
    } finally {
      setLoading(false);
    }
  };

  const migrateFromLocalStorage = async () => {
    const SETTINGS_KEY = 'snowdrop-settings';
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
      // Clear localStorage after migration attempt
      localStorage.removeItem(SETTINGS_KEY);
    }
  };

  const createDefaultSettings = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_settings')
        .insert({
          user_id: userId,
          theme: defaultSettings.theme,
          notifications: defaultSettings.notifications,
          location_services: defaultSettings.locationServices,
          preferences: defaultSettings.preferences
        });

      if (error) {
        console.error('Error creating default settings:', error);
      }
    } catch (error) {
      console.error('Error in createDefaultSettings:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Fallback to localStorage if not authenticated
        const SETTINGS_KEY = 'snowdrop-settings';
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
        return;
      }

      const updateData: any = {};
      if (newSettings.theme !== undefined) updateData.theme = newSettings.theme;
      if (newSettings.notifications !== undefined) updateData.notifications = newSettings.notifications;
      if (newSettings.locationServices !== undefined) updateData.location_services = newSettings.locationServices;
      if (newSettings.preferences !== undefined) updateData.preferences = newSettings.preferences;

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...updateData
        });

      if (error) {
        console.error('Error updating settings:', error);
        toast({
          title: "Error",
          description: "Failed to save settings. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Settings saved successfully!",
      });
    } catch (error) {
      console.error('Error in updateSettings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updatePreferences = async (type: 'books' | 'movies' | 'music', preferences: string[]) => {
    const updatedPreferences = {
      ...settings.preferences,
      [type]: preferences
    };
    
    await updateSettings({
      preferences: updatedPreferences
    });
  };

  return {
    settings,
    loading,
    updateSettings,
    updatePreferences,
    refreshSettings: fetchSettings
  };
};