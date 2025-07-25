import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

interface PreferenceSelectorProps {
  title: string;
  preferences: string[];
  suggestions: string[];
  onChange: (preferences: string[]) => void;
}

export const PreferenceSelector = ({ 
  title, 
  preferences, 
  suggestions, 
  onChange 
}: PreferenceSelectorProps) => {
  const [inputValue, setInputValue] = useState('');

  const addPreference = (preference: string) => {
    if (preference.trim() && !preferences.includes(preference.trim())) {
      onChange([...preferences, preference.trim()]);
      setInputValue('');
    }
  };

  const removePreference = (preference: string) => {
    onChange(preferences.filter(p => p !== preference));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPreference(inputValue);
    }
  };

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current preferences */}
        {preferences.length > 0 && (
          <div>
            <Label className="text-sm font-medium">Your Preferences:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {preferences.map((preference) => (
                <Badge
                  key={preference}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {preference}
                  <button
                    onClick={() => removePreference(preference)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Add new preference */}
        <div>
          <Label htmlFor={`${title}-input`} className="text-sm font-medium">
            Add New Preference:
          </Label>
          <div className="flex gap-2 mt-2">
            <Input
              id={`${title}-input`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type and press Enter"
              className="glass-card border-0"
            />
            <Button
              onClick={() => addPreference(inputValue)}
              size="sm"
              disabled={!inputValue.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Suggestions */}
        <div>
          <Label className="text-sm font-medium">Popular Choices:</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {suggestions
              .filter(suggestion => !preferences.includes(suggestion))
              .map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => addPreference(suggestion)}
                  className="text-xs h-7"
                >
                  + {suggestion}
                </Button>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};