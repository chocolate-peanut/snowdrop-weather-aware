import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Calendar as CalendarIcon, FileText, Settings as SettingsIcon, Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/pages/Calendar';
import { Planner } from '@/pages/Planner';
import { Settings } from '@/pages/Settings';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSettingsClick?: () => void;
  location?: string;
  searchLocation?: string;
  onLocationSearch?: (query: string) => void;
  onLocationSelect?: (location: string) => void;
  onCurrentLocationClick?: () => void;
  searchSuggestions?: string[];
  showSuggestions?: boolean;
  setShowSuggestions?: (show: boolean) => void;
  currentTime?: Date;
}

export const Layout = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  onSettingsClick,
  location,
  searchLocation,
  onLocationSearch,
  onLocationSelect,
  onCurrentLocationClick,
  searchSuggestions,
  showSuggestions,
  setShowSuggestions,
  currentTime
}: LayoutProps) => {
  const [showSettings, setShowSettings] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
    setActiveTab('settings');
  };

  const renderContent = () => {
    if (activeTab === 'settings' || showSettings) {
      return <Settings />;
    }
    if (activeTab === 'calendar') {
      return <Calendar />;
    }
    if (activeTab === 'planner') {
      return <Planner />;
    }
    return children;
  };

  const shouldShowSearch = activeTab === 'home';

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">SnowDrop</h1>
              {currentTime && (
                <p className="text-sm text-muted-foreground">{formatTime(currentTime)}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSettingsClick}
                className={activeTab === 'settings' ? 'text-primary bg-primary/10' : ''}
              >
                <SettingsIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Location Search - Only show on home tab */}
      {shouldShowSearch && location && onLocationSearch && (
        <div className="container mx-auto px-4 pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Enter any location (city, country, etc.)"
                value={searchLocation}
                onChange={(e) => onLocationSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onLocationSelect?.(searchLocation || '')}
                className="pl-10 glass-card border-0"
              />
            </div>
            <Button 
              onClick={() => onLocationSelect?.(searchLocation || '')}
              disabled={!searchLocation?.trim()}
              className="glass-card border-0"
            >
              Search
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={shouldShowSearch ? "pt-0" : "pt-6"}>
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-3">
            <button
              onClick={() => {
                setActiveTab("home");
                setShowSettings(false);
              }}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                activeTab === "home" ? "text-primary bg-primary/10" : "text-muted-foreground"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs font-medium">Home</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("calendar");
                setShowSettings(false);
              }}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                activeTab === "calendar" ? "text-primary bg-primary/10" : "text-muted-foreground"
              }`}
            >
              <CalendarIcon className="w-5 h-5" />
              <span className="text-xs font-medium">Calendar</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("planner");
                setShowSettings(false);
              }}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                activeTab === "planner" ? "text-primary bg-primary/10" : "text-muted-foreground"
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-xs font-medium">Planner</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};