import { InsertSubmission } from "@shared/schema";
import { fallbackAITools } from "./fallback-data";

// Real-time data fetcher for AI tools
export class AIToolDataFetcher {
  private static instance: AIToolDataFetcher;
  private apiKey: string | undefined;

  private constructor() {
    this.apiKey = process.env.AI_TOOLS_API_KEY;
  }

  static getInstance(): AIToolDataFetcher {
    if (!AIToolDataFetcher.instance) {
      AIToolDataFetcher.instance = new AIToolDataFetcher();
    }
    return AIToolDataFetcher.instance;
  }

  // Fetch data from Product Hunt API (AI tools)
  async fetchFromProductHunt(): Promise<InsertSubmission[]> {
    try {
      const response = await fetch('https://api.producthunt.com/v2/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PRODUCT_HUNT_API_KEY}`,
        },
        body: JSON.stringify({
          query: `
            query {
              posts(first: 50, topic: "artificial-intelligence") {
                edges {
                  node {
                    id
                    name
                    tagline
                    description
                    url
                    website
                    votesCount
                    commentsCount
                    createdAt
                    topics {
                      edges {
                        node {
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          `
        })
      });

      if (!response.ok) {
        throw new Error(`Product Hunt API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformProductHuntData(data.data.posts.edges);
    } catch (error) {
      console.error('Error fetching from Product Hunt:', error);
      return [];
    }
  }

  // Fetch data from GitHub trending AI repositories
  async fetchFromGitHub(): Promise<InsertSubmission[]> {
    try {
      const response = await fetch('https://api.github.com/search/repositories?q=topic:artificial-intelligence+topic:machine-learning+sort:stars&per_page=30', {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformGitHubData(data.items);
    } catch (error) {
      console.error('Error fetching from GitHub:', error);
      return [];
    }
  }

  // Fetch data from AI news and tool aggregators
  async fetchFromAINews(): Promise<InsertSubmission[]> {
    try {
      const response = await fetch('https://api.huggingface.co/api/models?sort=downloads&direction=-1&limit=20', {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformHuggingFaceData(data);
    } catch (error) {
      console.error('Error fetching from Hugging Face:', error);
      return [];
    }
  }

  // Transform Product Hunt data to our schema
  private transformProductHuntData(edges: any[]): InsertSubmission[] {
    return edges.map(edge => {
      const post = edge.node;
      return {
        name: post.name,
        category: this.categorizeAITool(post.topics?.edges?.map((t: any) => t.node.name) || []),
        url: post.website || post.url,
        pricing: this.inferPricing(post.description),
        shortDescription: post.tagline,
        detailedDescription: post.description,
        tags: post.topics?.edges?.map((t: any) => t.node.name.toLowerCase()) || [],
        contactEmail: `contact@${this.extractDomain(post.website || post.url)}`,
        status: "approved" as const,
        rating: this.calculateRating(post.votesCount, post.commentsCount),
        reviewCount: post.commentsCount || 0,
        clicks: 0,
        featured: post.votesCount > 500,
        sponsoredLevel: null,
        sponsorshipStartDate: null,
        sponsorshipEndDate: null,
        commissionRate: "0",
        affiliateUrl: null,
      };
    });
  }

  // Transform GitHub data to our schema
  private transformGitHubData(repos: any[]): InsertSubmission[] {
    return repos.map(repo => ({
      name: repo.name.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      category: this.categorizeAITool(repo.topics || []),
      url: repo.html_url,
      pricing: "free",
      shortDescription: repo.description || `Open-source ${repo.name} project`,
      detailedDescription: repo.description || `${repo.name} is an open-source project with ${repo.stargazers_count} stars on GitHub.`,
      tags: repo.topics || ["open-source", "github"],
      contactEmail: `contact@${this.extractDomain(repo.homepage || repo.html_url)}`,
      status: "approved" as const,
      rating: this.calculateGitHubRating(repo.stargazers_count, repo.forks_count),
      reviewCount: repo.forks_count || 0,
      clicks: 0,
      featured: repo.stargazers_count > 1000,
      sponsoredLevel: null,
      sponsorshipStartDate: null,
      sponsorshipEndDate: null,
      commissionRate: "0",
      affiliateUrl: null,
    }));
  }

  // Transform Hugging Face data to our schema
  private transformHuggingFaceData(models: any[]): InsertSubmission[] {
    return models.map(model => ({
      name: model.id.split('/').pop() || model.id,
      category: this.categorizeHuggingFaceModel(model.pipeline_tag),
      url: `https://huggingface.co/${model.id}`,
      pricing: "free",
      shortDescription: `AI model: ${model.pipeline_tag || 'Machine Learning'}`,
      detailedDescription: `${model.id} is a machine learning model with ${model.downloads || 0} downloads on Hugging Face.`,
      tags: [model.pipeline_tag, "huggingface", "ml-model", "ai"].filter(Boolean),
      contactEmail: "support@huggingface.co",
      status: "approved" as const,
      rating: this.calculateHuggingFaceRating(model.downloads),
      reviewCount: Math.floor((model.downloads || 0) / 100),
      clicks: 0,
      featured: (model.downloads || 0) > 10000,
      sponsoredLevel: null,
      sponsorshipStartDate: null,
      sponsorshipEndDate: null,
      commissionRate: "0",
      affiliateUrl: null,
    }));
  }

  // Helper methods
  private categorizeAITool(topics: string[]): string {
    const topicMap: { [key: string]: string } = {
      'natural-language-processing': 'natural-language-processing',
      'computer-vision': 'computer-vision',
      'machine-learning': 'machine-learning-platforms',
      'deep-learning': 'machine-learning-platforms',
      'artificial-intelligence': 'large-language-models',
      'chatbot': 'ai-chatbots',
      'automation': 'ai-automation',
      'productivity': 'ai-productivity-tools',
      'design': 'ai-design-tools',
      'writing': 'ai-writing-assistants',
      'code': 'ai-code-assistants',
      'art': 'ai-art-generators',
      'video': 'ai-video-tools',
      'audio': 'ai-audio-tools',
      'music': 'ai-music-generation',
      'translation': 'ai-translation',
      'healthcare': 'ai-healthcare',
      'finance': 'ai-finance',
      'education': 'ai-education',
      'marketing': 'ai-marketing',
      'analytics': 'ai-data-analytics',
      'robotics': 'ai-robotics',
      'gaming': 'ai-gaming',
      'cybersecurity': 'ai-cybersecurity',
      'research': 'ai-research-tools',
    };

    for (const topic of topics) {
      const category = topicMap[topic.toLowerCase()];
      if (category) return category;
    }

    return 'ai-productivity-tools'; // Default category
  }

  private categorizeHuggingFaceModel(pipelineTag: string): string {
    const pipelineMap: { [key: string]: string } = {
      'text-generation': 'large-language-models',
      'text-classification': 'natural-language-processing',
      'token-classification': 'natural-language-processing',
      'question-answering': 'natural-language-processing',
      'summarization': 'natural-language-processing',
      'translation': 'ai-translation',
      'text2text-generation': 'large-language-models',
      'fill-mask': 'natural-language-processing',
      'sentence-similarity': 'natural-language-processing',
      'text-to-speech': 'ai-audio-tools',
      'automatic-speech-recognition': 'ai-audio-tools',
      'audio-classification': 'ai-audio-tools',
      'image-classification': 'computer-vision',
      'object-detection': 'computer-vision',
      'image-segmentation': 'computer-vision',
      'text-to-image': 'ai-art-generators',
      'image-to-text': 'computer-vision',
      'conversational': 'ai-chatbots',
      'tabular-classification': 'ai-data-analytics',
      'tabular-regression': 'ai-data-analytics',
    };

    return pipelineMap[pipelineTag] || 'machine-learning-platforms';
  }

  private inferPricing(description: string): string {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('free') || lowerDesc.includes('open source')) return 'free';
    if (lowerDesc.includes('premium') || lowerDesc.includes('paid')) return 'paid';
    return 'freemium';
  }

  private calculateRating(votes: number, comments: number): string {
    const score = Math.min(5, Math.max(1, 3 + (votes / 100) + (comments / 50)));
    return score.toFixed(1);
  }

  private calculateGitHubRating(stars: number, forks: number): string {
    const score = Math.min(5, Math.max(1, 3 + (stars / 1000) + (forks / 200)));
    return score.toFixed(1);
  }

  private calculateHuggingFaceRating(downloads: number): string {
    const score = Math.min(5, Math.max(1, 3 + Math.log10(downloads || 1) / 2));
    return score.toFixed(1);
  }

  private extractDomain(url: string): string {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return 'example.com';
    }
  }

  // Main method to fetch all real-time data
  async fetchAllRealTimeData(): Promise<InsertSubmission[]> {
    console.log('🔄 Fetching real-time AI tool data...');
    
    // Check if we have any API keys configured
    const hasApiKeys = !!(
      process.env.PRODUCT_HUNT_API_KEY || 
      process.env.GITHUB_TOKEN || 
      process.env.HUGGINGFACE_API_KEY
    );

    if (!hasApiKeys) {
      console.log('⚠️  No API keys found, using curated fallback data');
      console.log('💡 Add PRODUCT_HUNT_API_KEY, GITHUB_TOKEN, or HUGGINGFACE_API_KEY for real-time data');
      return fallbackAITools;
    }

    try {
      const [productHuntData, githubData, huggingFaceData] = await Promise.all([
        this.fetchFromProductHunt().catch(err => {
          console.log('⚠️  Product Hunt API unavailable:', err.message);
          return [];
        }),
        this.fetchFromGitHub().catch(err => {
          console.log('⚠️  GitHub API unavailable:', err.message);
          return [];
        }),
        this.fetchFromAINews().catch(err => {
          console.log('⚠️  Hugging Face API unavailable:', err.message);
          return [];
        }),
      ]);

      const allData = [...productHuntData, ...githubData, ...huggingFaceData];
      
      // If no real-time data was fetched, use fallback
      if (allData.length === 0) {
        console.log('⚠️  No real-time data available, using curated fallback data');
        return fallbackAITools;
      }
      
      // Remove duplicates based on name
      const uniqueData = allData.filter((item, index, self) => 
        index === self.findIndex(t => t.name.toLowerCase() === item.name.toLowerCase())
      );

      console.log(`✅ Fetched ${uniqueData.length} unique AI tools from real-time sources`);
      return uniqueData;
    } catch (error) {
      console.error('❌ Error fetching real-time data:', error);
      console.log('⚠️  Falling back to curated data');
      return fallbackAITools;
    }
  }
}

export const aiToolFetcher = AIToolDataFetcher.getInstance();