import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Book, Film, Music, Star, ExternalLink } from 'lucide-react';

interface Recommendation {
  title: string;
  type: 'book' | 'movie' | 'music';
  genre: string;
  rating: number;
  description: string;
}

interface RecommendationCardProps {
  recommendations: Recommendation[];
  userPreferences: string[];
  type: 'book' | 'movie' | 'music';
}

const getIcon = (type: 'book' | 'movie' | 'music') => {
  switch (type) {
    case 'book': return <Book className="w-5 h-5" />;
    case 'movie': return <Film className="w-5 h-5" />;
    case 'music': return <Music className="w-5 h-5" />;
  }
};

const getTitle = (type: 'book' | 'movie' | 'music') => {
  switch (type) {
    case 'book': return 'Book Recommendations';
    case 'movie': return 'Movie Recommendations';
    case 'music': return 'Music Recommendations';
  }
};

const getExternalLink = (type: 'book' | 'movie' | 'music', title: string) => {
  const encodedTitle = encodeURIComponent(title);
  switch (type) {
    case 'book': return `https://www.goodreads.com/search?q=${encodedTitle}`;
    case 'movie': return `https://www.imdb.com/find?q=${encodedTitle}`;
    case 'music': return `https://open.spotify.com/search/${encodedTitle}`;
  }
};

// Shuffle array function for fresh recommendations
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Mock recommendations - in a real app, these would come from an API
const mockRecommendations: Record<string, Recommendation[]> = {
  book: [
    {
      title: "The Seven Husbands of Evelyn Hugo",
      type: "book",
      genre: "Fiction",
      rating: 4.8,
      description: "A captivating novel about a reclusive Hollywood icon"
    },
    {
      title: "Dune",
      type: "book",
      genre: "Science Fiction",
      rating: 4.6,
      description: "Epic space opera set in a distant future"
    },
    {
      title: "The Silent Patient",
      type: "book",
      genre: "Mystery",
      rating: 4.5,
      description: "Psychological thriller about a woman who refuses to speak"
    }
  ],
  movie: [
    {
      title: "Everything Everywhere All at Once",
      type: "movie",
      genre: "Comedy",
      rating: 4.7,
      description: "Multiverse adventure with heart and humor"
    },
    {
      title: "Inception",
      type: "movie",
      genre: "Science Fiction",
      rating: 4.8,
      description: "Mind-bending thriller about dreams within dreams"
    },
    {
      title: "Knives Out",
      type: "movie",
      genre: "Mystery",
      rating: 4.6,
      description: "Modern whodunit with clever twists"
    }
  ],
  music: [
    {
      title: "Folklore",
      type: "music",
      genre: "Pop",
      rating: 4.9,
      description: "Taylor Swift's introspective indie folk masterpiece"
    },
    {
      title: "Random Access Memories",
      type: "music",
      genre: "Electronic",
      rating: 4.7,
      description: "Daft Punk's disco-influenced electronic album"
    },
    {
      title: "The Dark Side of the Moon",
      type: "music",
      genre: "Rock",
      rating: 4.8,
      description: "Pink Floyd's progressive rock concept album"
    }
  ]
};

export const RecommendationCard = ({ type, userPreferences }: RecommendationCardProps) => {
  const allRecommendations = mockRecommendations[type] || [];
  
  // Shuffle recommendations for fresh content on each render
  const shuffledRecommendations = shuffleArray(allRecommendations);
  
  // Filter recommendations based on user preferences
  const filteredRecommendations = userPreferences.length > 0 
    ? shuffledRecommendations.filter(rec => 
        userPreferences.some(pref => 
          rec.genre.toLowerCase().includes(pref.toLowerCase())
        )
      )
    : shuffledRecommendations.slice(0, 2); // Show 2 random recommendations if no preferences

  const recommendations = filteredRecommendations.slice(0, 3);

  const handleRecommendationClick = (rec: Recommendation) => {
    const externalLink = getExternalLink(type, rec.title);
    window.open(externalLink, '_blank', 'noopener,noreferrer');
  };

  if (recommendations.length === 0) {
    return (
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getIcon(type)}
            {getTitle(type)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Set your {type} preferences in Settings to see personalized recommendations!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getIcon(type)}
          {getTitle(type)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => (
          <div 
            key={index} 
            className="border-l-2 border-primary/20 pl-4 cursor-pointer transition-all duration-200 hover:border-primary/40 hover:bg-muted/30 rounded-r-md -mr-2 pr-2 py-2 group"
            onClick={() => handleRecommendationClick(rec)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {rec.title}
                  </h4>
                  <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {rec.genre}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">{rec.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{rec.description}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};