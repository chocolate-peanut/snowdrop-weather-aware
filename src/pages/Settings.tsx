import { useSettings } from '@/hooks/useSettings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PreferenceSelector } from '@/components/PreferenceSelector';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Palette, Bell, MapPin, BookOpen, Film, Music } from 'lucide-react';
import { useTheme } from 'next-themes';

export const Settings = () => {
  const { settings, updateSettings, updatePreferences } = useSettings();
  const { theme, setTheme } = useTheme();

  const bookSuggestions = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 
    'Fantasy', 'Biography', 'History', 'Self-Help', 'Thriller'
  ];

  const movieSuggestions = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Science Fiction', 
    'Romance', 'Thriller', 'Documentary', 'Animation', 'Adventure'
  ];

  const musicSuggestions = [
    'Pop', 'Rock', 'Hip Hop', 'Jazz', 'Classical', 
    'Electronic', 'Country', 'R&B', 'Indie', 'Folk'
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-2">
        <SettingsIcon className="w-6 h-6" />
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      </div>

      {/* Theme Settings */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="theme-select">Theme</Label>
              <Select
                value={theme}
                onValueChange={(value: 'light' | 'dark' | 'system') => {
                  setTheme(value);
                  updateSettings({ theme: value });
                }}
              >
                <SelectTrigger className="glass-card border-0 mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                Choose your preferred color scheme
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Settings */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>App Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label htmlFor="notifications">Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive weather alerts and plan reminders
                </p>
              </div>
            </div>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(checked) => updateSettings({ notifications: checked })}
            />
          </div>

          <Separator />

          {/* Location Services */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label htmlFor="location">Location Services</Label>
                <p className="text-sm text-muted-foreground">
                  Allow location access for better weather accuracy
                </p>
              </div>
            </div>
            <Switch
              id="location"
              checked={settings.locationServices}
              onCheckedChange={(checked) => updateSettings({ locationServices: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          <h2 className="text-lg font-semibold text-foreground">Content Preferences</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Set your preferences to get personalized recommendations for indoor activities
        </p>

        <PreferenceSelector
          title="Book Preferences"
          preferences={settings.preferences.books}
          suggestions={bookSuggestions}
          onChange={(preferences) => updatePreferences('books', preferences)}
        />

        <PreferenceSelector
          title="Movie Preferences"
          preferences={settings.preferences.movies}
          suggestions={movieSuggestions}
          onChange={(preferences) => updatePreferences('movies', preferences)}
        />

        <PreferenceSelector
          title="Music Preferences"
          preferences={settings.preferences.music}
          suggestions={musicSuggestions}
          onChange={(preferences) => updatePreferences('music', preferences)}
        />
      </div>
    </div>
  );
};