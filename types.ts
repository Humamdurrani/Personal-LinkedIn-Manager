export type Tool =
  | 'profile-optimizer'
  | 'content-strategy'
  | 'post-writer'
  | 'carousel-creator'
  | 'post-time-finder'
  | 'content-library'
  | 'performance-tracker';

export interface StoredContent {
  id: string;
  tool: 'strategy' | 'post';
  prompt: string;
  content: string;
  rating: 'good' | 'bad' | null;
  timestamp: number;
}

export interface CarouselSlide {
  slide: number;
  title: string;
  content: string;
  visualSuggestion: string;
  imageUrl?: string;
  isGeneratingImage?: boolean;
}
