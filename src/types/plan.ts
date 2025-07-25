export interface Plan {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  activity: string;
  type: 'outdoor' | 'indoor';
  description?: string;
}

export interface UserPreferences {
  books: string[];
  movies: string[];
  music: string[];
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  locationServices: boolean;
  preferences: UserPreferences;
}