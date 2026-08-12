export type Platform = 'twitter' | 'instagram' | 'tiktok' | 'linkedin' | 'whatsapp' | 'threads' | 'facebook';

export type Tone = 
  | 'humorous' 
  | 'controversial' 
  | 'inspirational' 
  | 'educational' 
  | 'relatable' 
  | 'storytelling' 
  | 'unpopular_opinion' 
  | 'minimalist' 
  | 'urgency';

export type RegionalStyle = 'general' | 'mexico' | 'argentina' | 'espana' | 'colombia' | 'spanglish';

export type Category = 
  | 'all'
  | 'tech_ai' 
  | 'humor_memes' 
  | 'fitness_health' 
  | 'finance_business' 
  | 'lifestyle_relationships' 
  | 'pop_culture' 
  | 'motivation' 
  | 'gaming' 
  | 'news_curiosities';

export interface TrendItem {
  id: string;
  title: string;
  category: Category;
  viralityIndex: number; // 1-100
  summary: string;
  keywords: string[];
  viralAngles: string[];
  whyItTrends: string;
  sampleHooks: string[];
  groundedSources?: { title: string; url: string }[];
}

export interface GeneratedStatusOption {
  id: string;
  headline: string; // Brief label/hook description
  content: string; // Main text
  formattingType: 'single' | 'thread' | 'carousel' | 'short_hook';
  threadParts?: string[];
  hashtags: string[];
  emojisCount: number;
  viralityScore: number; // 1-100
  viralityReasoning: string;
  visualPromptRecommendation?: string;
  callToAction?: string;
  suggestedBestTime?: string;
}

export interface GenerateStatusRequest {
  topic?: string;
  trendId?: string;
  trendTitle?: string;
  trendContext?: string;
  platform: Platform;
  tone: Tone;
  regionalStyle?: RegionalStyle;
  audience?: string;
  goal?: 'virality' | 'comments' | 'saves' | 'shares' | 'followers';
  includeHashtags?: boolean;
  emojiDensity?: 'high' | 'medium' | 'low' | 'none';
  customInstructions?: string;
}

export interface GenerateStatusResponse {
  options: GeneratedStatusOption[];
  topicAnalyzed: string;
  suggestedHashtags: string[];
  idealPostingTimes: string;
}

export interface ViralityAnalysisRequest {
  text: string;
  platform?: Platform;
}

export interface ViralityAnalysisResponse {
  score: number; // 1-100
  hookPower: number; // 1-100
  emotionalTriggers: string[];
  readabilityScore: string;
  strengths: string[];
  weaknesses: string[];
  improvedVersions: {
    angle: string;
    text: string;
    whyBetter: string;
  }[];
}

export interface SavedStatusItem extends GeneratedStatusOption {
  savedAt: string;
  platform: Platform;
  topic: string;
  tone: Tone;
}
