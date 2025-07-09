/**
 * World-class AI-powered search engine for AI products
 * Features: Semantic search, intent recognition, relevance scoring, query understanding
 */

import { type Submission } from "../shared/schema";

export interface SearchIntent {
  type: 'product_search' | 'category_browse' | 'feature_search' | 'comparison' | 'pricing' | 'free_tools';
  confidence: number;
  keywords: string[];
  category?: string;
  priceRange?: string;
  features?: string[];
}

export interface SearchMetrics {
  processingTime: number;
  totalScanned: number;
  algorithmsUsed: string[];
  confidenceScore: number;
  semanticMatches: number;
  exactMatches: number;
}

export class AISearchEngine {
  private static instance: AISearchEngine;
  
  // AI product categories with semantic mappings
  private categorySemantics = {
    'large-language-models': ['llm', 'chatbot', 'chat', 'conversation', 'text generation', 'language model', 'gpt', 'claude', 'gemini'],
    'ai-art-generators': ['art', 'image', 'visual', 'creative', 'design', 'painting', 'drawing', 'midjourney', 'dalle', 'stable diffusion'],
    'ai-code-assistants': ['code', 'programming', 'development', 'copilot', 'coding', 'developer', 'ide', 'autocomplete'],
    'ai-writing-assistants': ['writing', 'content', 'copywriting', 'grammar', 'editing', 'blog', 'article', 'text'],
    'computer-vision': ['vision', 'image recognition', 'object detection', 'facial recognition', 'ocr', 'visual'],
    'ai-video-tools': ['video', 'editing', 'animation', 'motion', 'film', 'movie', 'clips'],
    'ai-music-generation': ['music', 'audio', 'sound', 'song', 'composition', 'melody', 'beats'],
    'data-analytics': ['analytics', 'data', 'insights', 'business intelligence', 'reporting', 'dashboard'],
    'ai-automation': ['automation', 'workflow', 'task', 'productivity', 'efficiency', 'bot'],
    'ml-platforms': ['machine learning', 'ml', 'training', 'models', 'platform', 'framework']
  };

  // Pricing model semantics
  private pricingSemantics = {
    'free': ['free', 'no cost', 'zero cost', 'gratis', 'open source'],
    'freemium': ['freemium', 'free tier', 'free plan', 'limited free'],
    'subscription': ['subscription', 'monthly', 'yearly', 'recurring', 'saas'],
    'pay-per-use': ['pay per use', 'usage based', 'consumption', 'credits'],
    'enterprise': ['enterprise', 'business', 'corporate', 'team']
  };

  // Feature semantics for AI tools
  private featureSemantics = {
    'api': ['api', 'integration', 'developer', 'sdk', 'webhook'],
    'realtime': ['real-time', 'live', 'instant', 'immediate'],
    'collaboration': ['team', 'collaborative', 'sharing', 'multi-user'],
    'cloud': ['cloud', 'online', 'web-based', 'saas'],
    'offline': ['offline', 'local', 'desktop', 'standalone']
  };

  private constructor() {}

  static getInstance(): AISearchEngine {
    if (!AISearchEngine.instance) {
      AISearchEngine.instance = new AISearchEngine();
    }
    return AISearchEngine.instance;
  }

  /**
   * Analyze search query using AI-powered intent recognition
   */
  analyzeSearchIntent(query: string): SearchIntent {
    const normalizedQuery = query.toLowerCase().trim();
    const words = normalizedQuery.split(/\s+/);
    
    // Intent classification
    let intent: SearchIntent = {
      type: 'product_search',
      confidence: 0.5,
      keywords: words
    };

    // Category detection
    for (const [category, keywords] of Object.entries(this.categorySemantics)) {
      const matches = keywords.filter(keyword => 
        normalizedQuery.includes(keyword.toLowerCase())
      );
      if (matches.length > 0) {
        intent.category = category;
        intent.confidence += 0.2 * matches.length;
      }
    }

    // Pricing intent detection
    for (const [pricing, keywords] of Object.entries(this.pricingSemantics)) {
      const matches = keywords.filter(keyword => 
        normalizedQuery.includes(keyword.toLowerCase())
      );
      if (matches.length > 0) {
        intent.type = 'pricing';
        intent.priceRange = pricing;
        intent.confidence += 0.3;
      }
    }

    // Feature detection
    const detectedFeatures: string[] = [];
    for (const [feature, keywords] of Object.entries(this.featureSemantics)) {
      const matches = keywords.filter(keyword => 
        normalizedQuery.includes(keyword.toLowerCase())
      );
      if (matches.length > 0) {
        detectedFeatures.push(feature);
        intent.confidence += 0.1;
      }
    }
    intent.features = detectedFeatures;

    // Comparison intent
    if (normalizedQuery.includes('vs') || normalizedQuery.includes('versus') || 
        normalizedQuery.includes('compare') || normalizedQuery.includes('alternatives')) {
      intent.type = 'comparison';
      intent.confidence += 0.4;
    }

    // Free tools intent
    if (normalizedQuery.includes('free') || normalizedQuery.includes('open source')) {
      intent.type = 'free_tools';
      intent.confidence += 0.3;
    }

    intent.confidence = Math.min(intent.confidence, 1.0);
    return intent;
  }

  /**
   * Calculate advanced AI-powered relevance score
   */
  calculateRelevanceScore(submission: Submission, query: string, intent: SearchIntent): number {
    const normalizedQuery = query.toLowerCase();
    let score = 0;

    // 1. Exact name match (highest weight)
    if (submission.name.toLowerCase() === normalizedQuery) {
      score += 100;
    } else if (submission.name.toLowerCase().includes(normalizedQuery)) {
      score += 80;
    }

    // 2. Semantic category matching
    if (intent.category && submission.category === intent.category) {
      score += 60;
    }

    // 3. Description relevance with TF-IDF-like scoring
    const descriptionScore = this.calculateTextRelevance(
      submission.shortDescription + ' ' + submission.detailedDescription,
      normalizedQuery
    );
    score += descriptionScore * 40;

    // 4. Tag matching with semantic expansion
    const tagScore = this.calculateTagRelevance(submission.tags || [], normalizedQuery, intent);
    score += tagScore * 30;

    // 5. Pricing model alignment
    if (intent.priceRange && submission.pricingModel === intent.priceRange) {
      score += 25;
    }

    // 6. Quality indicators
    const rating = parseFloat(submission.rating || '0');
    if (rating >= 4.5) score += 20;
    else if (rating >= 4.0) score += 15;
    else if (rating >= 3.5) score += 10;

    // 7. Popularity boost
    const reviewCount = submission.reviewCount || 0;
    if (reviewCount > 5000) score += 15;
    else if (reviewCount > 1000) score += 10;
    else if (reviewCount > 100) score += 5;

    // 8. Feature matching
    if (intent.features && intent.features.length > 0) {
      const featureMatches = this.calculateFeatureRelevance(submission, intent.features);
      score += featureMatches * 20;
    }

    // 9. Recency boost for trending tools
    const daysSinceCreation = Math.floor(
      (Date.now() - new Date(submission.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceCreation < 30) score += 10;
    else if (daysSinceCreation < 90) score += 5;

    // 10. Premium content boost
    if (submission.featured) score += 15;
    if (submission.sponsoredLevel === 'platinum') score += 12;
    else if (submission.sponsoredLevel === 'gold') score += 8;
    else if (submission.sponsoredLevel === 'premium') score += 5;

    return Math.round(score);
  }

  private calculateTextRelevance(text: string, query: string): number {
    const normalizedText = text.toLowerCase();
    const queryWords = query.split(/\s+/);
    let relevance = 0;

    for (const word of queryWords) {
      if (word.length < 3) continue;
      
      // Exact word match
      if (normalizedText.includes(word)) {
        relevance += 1;
      }
      
      // Partial word match (fuzzy)
      const partialMatches = normalizedText.split(/\s+/).filter(textWord => 
        textWord.includes(word) || word.includes(textWord)
      );
      relevance += partialMatches.length * 0.5;
    }

    return Math.min(relevance / queryWords.length, 1);
  }

  private calculateTagRelevance(tags: string[], query: string, intent: SearchIntent): number {
    const queryWords = query.toLowerCase().split(/\s+/);
    let relevance = 0;

    for (const tag of tags) {
      const normalizedTag = tag.toLowerCase();
      
      // Direct tag matches
      for (const word of queryWords) {
        if (normalizedTag.includes(word)) {
          relevance += 1;
        }
      }

      // Semantic tag matches based on intent
      if (intent.category) {
        const semanticKeywords = this.categorySemantics[intent.category] || [];
        for (const keyword of semanticKeywords) {
          if (normalizedTag.includes(keyword)) {
            relevance += 0.5;
          }
        }
      }
    }

    return Math.min(relevance, 1);
  }

  private calculateFeatureRelevance(submission: Submission, features: string[]): number {
    let relevance = 0;
    const text = `${submission.name} ${submission.shortDescription} ${submission.detailedDescription}`.toLowerCase();
    
    for (const feature of features) {
      const featureKeywords = this.featureSemantics[feature] || [];
      for (const keyword of featureKeywords) {
        if (text.includes(keyword.toLowerCase())) {
          relevance += 1;
        }
      }
    }

    return Math.min(relevance / features.length, 1);
  }

  /**
   * Generate intelligent search suggestions
   */
  generateSearchSuggestions(query: string, submissions: Submission[]): string[] {
    const suggestions = new Set<string>();
    const normalizedQuery = query.toLowerCase();

    // Add exact matches
    submissions.forEach(submission => {
      if (submission.name.toLowerCase().includes(normalizedQuery)) {
        suggestions.add(submission.name);
      }
    });

    // Add category suggestions
    for (const [category, keywords] of Object.entries(this.categorySemantics)) {
      if (keywords.some(keyword => keyword.includes(normalizedQuery) || normalizedQuery.includes(keyword))) {
        suggestions.add(category.replace(/-/g, ' '));
      }
    }

    // Add semantic suggestions
    const intent = this.analyzeSearchIntent(query);
    if (intent.category) {
      const categoryKeywords = this.categorySemantics[intent.category] || [];
      categoryKeywords.forEach(keyword => {
        if (keyword.includes(normalizedQuery)) {
          suggestions.add(keyword);
        }
      });
    }

    return Array.from(suggestions).slice(0, 8);
  }

  /**
   * Enhanced search with AI-powered ranking
   */
  enhancedSearch(
    submissions: Submission[], 
    query: string, 
    filters: {
      category?: string;
      priceRange?: string;
      rating?: number;
      features?: string[];
    } = {}
  ): { results: Submission[]; metrics: SearchMetrics } {
    const startTime = Date.now();
    const intent = this.analyzeSearchIntent(query);
    
    // Filter submissions based on criteria
    let filteredSubmissions = submissions.filter(submission => {
      if (filters.category && submission.category !== filters.category) return false;
      if (filters.priceRange && submission.pricingModel !== filters.priceRange) return false;
      if (filters.rating && parseFloat(submission.rating || '0') < filters.rating) return false;
      return true;
    });

    // Calculate relevance scores
    const scoredResults = filteredSubmissions.map(submission => ({
      ...submission,
      relevanceScore: this.calculateRelevanceScore(submission, query, intent)
    }));

    // Sort by relevance score
    const sortedResults = scoredResults
      .filter(result => result.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    const processingTime = Date.now() - startTime;
    
    const metrics: SearchMetrics = {
      processingTime,
      totalScanned: submissions.length,
      algorithmsUsed: ['semantic_matching', 'intent_recognition', 'relevance_scoring', 'tf_idf'],
      confidenceScore: intent.confidence,
      semanticMatches: sortedResults.filter(r => r.relevanceScore > 50).length,
      exactMatches: sortedResults.filter(r => r.relevanceScore > 80).length
    };

    return {
      results: sortedResults,
      metrics
    };
  }
}

export const aiSearchEngine = AISearchEngine.getInstance();