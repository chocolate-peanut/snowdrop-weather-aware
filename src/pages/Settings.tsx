import { useSettings } from "@/hooks/useSettings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PreferenceSelector } from "@/components/PreferenceSelector";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Settings as SettingsIcon,
  Palette,
  Bell,
  MapPin,
  BookOpen,
  Film,
  Music,
  Wifi,
} from "lucide-react";
import { useTheme } from "next-themes";
import { LocationContextIndicator } from "@/components/LocationContextIndicator";
import { useState } from "react";

export const Settings = () => {
  const { settings, updateSettings, updatePreferences } = useSettings();
  const { theme, setTheme } = useTheme();
  const [homeWifiSSID, setHomeWifiSSID] = useState(
    localStorage.getItem('homeWifiSSID') || ''
  );

  const handleSaveWifiSSID = () => {
    localStorage.setItem('homeWifiSSID', homeWifiSSID);
  };

  const bookSuggestions = [
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Romance",
    "Science Fiction",
    "Fantasy",
    "Biography",
    "History",
    "Self-Help",
    "Thriller",
  ];

  const movieSuggestions = [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Science Fiction",
    "Romance",
    "Thriller",
    "Documentary",
    "Animation",
    "Adventure",
  ];

  const musicSuggestions = [
    "Pop",
    "Rock",
    "Hip Hop",
    "Jazz",
    "Classical",
    "Electronic",
    "Country",
    "R&B",
    "Indie",
    "Folk",
  ];

  return (
    <div className="container mx-auto px-4 pb-6 space-y-6">
      <div className="flex items-center gap-2 px-2">
        <SettingsIcon className="w-6 h-6" />
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
      </div>

      {/* Theme Settings */}
      <Card className="glass-card border-0">
        <CardHeader>
          <h2 className="text-lg font-semibold text-foreground">
            Theme Settings
          </h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="theme-select">Theme</Label>
              <Select
                value={theme}
                onValueChange={(value: "light" | "dark" | "system") => {
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
          <h2 className="text-lg font-semibold text-foreground">
            App Settings
          </h2>
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
              onCheckedChange={(checked) =>
                updateSettings({ notifications: checked })
              }
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
              onCheckedChange={(checked) =>
                updateSettings({ locationServices: checked })
              }
            />
          </div>

          <Separator />

          {/* Home WiFi Configuration */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <Label htmlFor="homeWifi">Home WiFi Network (Optional)</Label>
                <p className="text-sm text-muted-foreground">
                  Set your home WiFi to improve indoor/outdoor detection
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                id="homeWifi"
                type="text"
                placeholder="Enter your home WiFi SSID"
                value={homeWifiSSID}
                onChange={(e) => setHomeWifiSSID(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSaveWifiSSID} variant="secondary">
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Context Detection */}
      <LocationContextIndicator homeWifiSSID={homeWifiSSID || undefined} />

      {/* Preferences */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <BookOpen className="w-5 h-5" />
          <h1 className="text-xl font-semibold text-foreground">
            Content Preferences
          </h1>
        </div>
        <p className="text-sm text-muted-foreground px-2">
          Set your preferences to get personalized recommendations for indoor
          activities
        </p>

        <PreferenceSelector
          title="Book Preferences"
          preferences={settings.preferences.books}
          suggestions={bookSuggestions}
          onChange={(preferences) => updatePreferences("books", preferences)}
        />

        <PreferenceSelector
          title="Movie Preferences"
          preferences={settings.preferences.movies}
          suggestions={movieSuggestions}
          onChange={(preferences) => updatePreferences("movies", preferences)}
        />

        <PreferenceSelector
          title="Music Preferences"
          preferences={settings.preferences.music}
          suggestions={musicSuggestions}
          onChange={(preferences) => updatePreferences("music", preferences)}
        />
      </div>
    </div>
  );
};
