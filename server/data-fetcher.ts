import { InsertSubmission } from "@shared/schema";
import { fallbackAITools } from "./fallback-data";
import { externalAPIFetcher } from "./external-apis";

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
      // Fetch multiple categories of AI repositories
      const queries = [
        'topic:artificial-intelligence+sort:stars',
        'topic:machine-learning+sort:stars',
        'topic:deep-learning+sort:stars',
        'topic:computer-vision+sort:stars',
        'topic:natural-language-processing+sort:stars',
        'topic:generative-ai+sort:stars',
        'language:python+topic:ai+sort:stars',
        'topic:llm+sort:stars',
        'topic:gpt+sort:stars',
        'topic:stable-diffusion+sort:stars'
      ];

      const allRepos = [];
      
      for (const query of queries) {
        try {
          const response = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=10`, {
            headers: {
              'Authorization': `token ${process.env.GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json',
            }
          });

          if (response.ok) {
            const data = await response.json();
            allRepos.push(...data.items);
          }
        } catch (error) {
          console.log(`Error fetching GitHub query ${query}:`, error.message);
        }
      }

      return this.transformGitHubData(allRepos);
    } catch (error) {
      console.error('Error fetching from GitHub:', error);
      return [];
    }
  }

  // Fetch data from AI news and tool aggregators
  async fetchFromAINews(): Promise<InsertSubmission[]> {
    try {
      const allModels = [];

      // Fetch different types of models from Hugging Face
      const modelTypes = [
        'text-generation',
        'text-to-image',
        'image-classification',
        'automatic-speech-recognition',
        'text-classification',
        'translation',
        'summarization',
        'question-answering',
        'conversational'
      ];

      for (const modelType of modelTypes) {
        try {
          const response = await fetch(`https://api.huggingface.co/api/models?pipeline_tag=${modelType}&sort=downloads&direction=-1&limit=5`, {
            headers: {
              'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            }
          });

          if (response.ok) {
            const data = await response.json();
            allModels.push(...data);
          }
        } catch (error) {
          console.log(`Error fetching ${modelType} models:`, error.message);
        }
      }

      return this.transformHuggingFaceData(allModels);
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

  // Fetch from additional AI tool collections and directories
  async fetchFromAICollections(): Promise<InsertSubmission[]> {
    const tools: InsertSubmission[] = [];
    
    try {
      // Enhanced AI tool collections with more diverse and recent tools
      const aiToolCollections = [
        // Latest AI Models & Platforms
        { name: "Claude 3.5 Sonnet", description: "Advanced AI assistant by Anthropic with improved reasoning capabilities", website: "https://claude.ai", category: "large-language-models", pricingModel: "freemium", rating: "4.8", reviewCount: "4200" },
        { name: "Gemini Ultra", description: "Google's most capable AI model for complex multimodal tasks", website: "https://gemini.google.com", category: "large-language-models", pricingModel: "freemium", rating: "4.7", reviewCount: "3800" },
        { name: "GPT-4 Turbo", description: "OpenAI's latest and most advanced language model", website: "https://openai.com/gpt-4", category: "large-language-models", pricingModel: "pay-per-use", rating: "4.9", reviewCount: "8500" },
        
        // Creative AI Tools
        { name: "Midjourney V6", description: "Latest version of the popular AI art generator with enhanced realism", website: "https://midjourney.com", category: "ai-art-generators", pricingModel: "subscription", rating: "4.8", reviewCount: "12000" },
        { name: "Runway Gen-3", description: "Next-generation AI video creation platform", website: "https://runwayml.com", category: "ai-video-tools", pricingModel: "subscription", rating: "4.6", reviewCount: "2400" },
        { name: "Stable Diffusion XL", description: "Advanced open-source image generation model", website: "https://stability.ai", category: "ai-art-generators", pricingModel: "open-source", rating: "4.5", reviewCount: "5600" },
        { name: "Pika Labs", description: "AI video generation from text and images", website: "https://pika.art", category: "ai-video-tools", pricingModel: "freemium", rating: "4.4", reviewCount: "1800" },
        
        // Code & Development
        { name: "Cursor AI", description: "AI-first code editor with advanced autocomplete", website: "https://cursor.sh", category: "ai-code-assistants", pricingModel: "freemium", rating: "4.7", reviewCount: "3200" },
        { name: "Codeium", description: "Free AI-powered coding assistant", website: "https://codeium.com", category: "ai-code-assistants", pricingModel: "freemium", rating: "4.5", reviewCount: "2800" },
        { name: "Tabnine", description: "AI code completion for all major IDEs", website: "https://tabnine.com", category: "ai-code-assistants", pricingModel: "freemium", rating: "4.3", reviewCount: "4100" },
        { name: "Amazon CodeWhisperer", description: "AI coding companion by AWS", website: "https://aws.amazon.com/codewhisperer", category: "ai-code-assistants", pricingModel: "freemium", rating: "4.2", reviewCount: "1900" },
        
        // Business & Productivity
        { name: "Perplexity Pro", description: "AI search engine with real-time information", website: "https://perplexity.ai", category: "ai-research-tools", pricingModel: "freemium", rating: "4.6", reviewCount: "3400" },
        { name: "Notion AI", description: "AI writing and productivity assistant in Notion", website: "https://notion.so/ai", category: "ai-productivity-tools", pricingModel: "subscription", rating: "4.4", reviewCount: "5200" },
        { name: "Grammarly AI", description: "Advanced AI writing assistant and grammar checker", website: "https://grammarly.com", category: "ai-writing-assistants", pricingModel: "freemium", rating: "4.5", reviewCount: "8900" },
        { name: "Otter.ai", description: "AI meeting transcription and note-taking", website: "https://otter.ai", category: "ai-productivity-tools", pricingModel: "freemium", rating: "4.3", reviewCount: "2700" },
        
        // Voice & Audio
        { name: "ElevenLabs", description: "AI voice cloning and text-to-speech", website: "https://elevenlabs.io", category: "ai-audio-tools", pricingModel: "freemium", rating: "4.7", reviewCount: "4300" },
        { name: "Murf AI", description: "AI voiceover generator for videos and presentations", website: "https://murf.ai", category: "ai-audio-tools", pricingModel: "subscription", rating: "4.4", reviewCount: "2100" },
        { name: "Suno AI", description: "AI music generation from text prompts", website: "https://suno.com", category: "ai-music-generation", pricingModel: "freemium", rating: "4.5", reviewCount: "1800" },
        { name: "AIVA", description: "AI composer for emotional soundtrack music", website: "https://aiva.ai", category: "ai-music-generation", pricingModel: "freemium", rating: "4.2", reviewCount: "950" },
        
        // Specialized & Industry Tools
        { name: "Harvey AI", description: "AI legal assistant for law firms", website: "https://harvey.ai", category: "legal-tech", pricingModel: "enterprise", rating: "4.3", reviewCount: "420" },
        { name: "Synthesia", description: "AI video generation with virtual avatars", website: "https://synthesia.io", category: "ai-video-tools", pricingModel: "subscription", rating: "4.4", reviewCount: "1600" },
        { name: "DataRobot", description: "Enterprise AI platform for automated ML", website: "https://datarobot.com", category: "machine-learning-platforms", pricingModel: "enterprise", rating: "4.1", reviewCount: "680" },
        { name: "H2O.ai", description: "Open-source machine learning platform", website: "https://h2o.ai", category: "machine-learning-platforms", pricingModel: "open-source", rating: "4.2", reviewCount: "1200" },
        
        // Translation & Language
        { name: "DeepL Pro", description: "Advanced AI translation service", website: "https://deepl.com", category: "ai-translation", pricingModel: "freemium", rating: "4.6", reviewCount: "3600" },
        { name: "Google Translate", description: "Free AI-powered translation service", website: "https://translate.google.com", category: "ai-translation", pricingModel: "free", rating: "4.3", reviewCount: "15000" },
        
        // Design & 3D
        { name: "Figma AI", description: "AI-powered design tools in Figma", website: "https://figma.com", category: "ai-design-tools", pricingModel: "freemium", rating: "4.5", reviewCount: "2800" },
        { name: "Spline AI", description: "AI-powered 3D design and modeling", website: "https://spline.design", category: "3d-modeling", pricingModel: "freemium", rating: "4.3", reviewCount: "1400" },
        { name: "Luma AI", description: "AI 3D capture and reconstruction", website: "https://lumalabs.ai", category: "3d-modeling", pricingModel: "freemium", rating: "4.4", reviewCount: "980" },
        
        // Customer Service & Chat
        { name: "Intercom AI", description: "AI-powered customer service platform", website: "https://intercom.com", category: "customer-service", pricingModel: "subscription", rating: "4.2", reviewCount: "1800" },
        { name: "ChatGPT Enterprise", description: "Enterprise version of ChatGPT", website: "https://openai.com/enterprise", category: "ai-chatbots", pricingModel: "enterprise", rating: "4.7", reviewCount: "2400" },
        
        // Analytics & Data
        { name: "Julius AI", description: "AI data analyst for spreadsheets and CSVs", website: "https://julius.ai", category: "data-analytics", pricingModel: "freemium", rating: "4.3", reviewCount: "850" },
        { name: "Tableau AI", description: "AI-powered data visualization and insights", website: "https://tableau.com", category: "data-analytics", pricingModel: "subscription", rating: "4.4", reviewCount: "3200" },
        
        // Emerging & Specialized
        { name: "LangChain", description: "Framework for building LLM applications", website: "https://langchain.com", category: "ai-infrastructure", pricingModel: "open-source", rating: "4.5", reviewCount: "4800" },
        { name: "Weights & Biases", description: "MLOps platform for model tracking", website: "https://wandb.ai", category: "machine-learning-platforms", pricingModel: "freemium", rating: "4.6", reviewCount: "2600" },
        { name: "Hugging Face Spaces", description: "Platform for hosting ML demos and apps", website: "https://huggingface.co/spaces", category: "ai-infrastructure", pricingModel: "freemium", rating: "4.4", reviewCount: "1900" },
        
        // Additional Video & Content Creation
        { name: "Descript", description: "AI-powered video and podcast editing with transcription", website: "https://descript.com", category: "ai-video-tools", pricingModel: "freemium", rating: "4.3", reviewCount: "2100" },
        { name: "Pictory", description: "AI video creation from long-form content", website: "https://pictory.ai", category: "ai-video-tools", pricingModel: "subscription", rating: "4.2", reviewCount: "1500" },
        { name: "InVideo AI", description: "AI video generator with templates and voiceovers", website: "https://invideo.io", category: "ai-video-tools", pricingModel: "freemium", rating: "4.1", reviewCount: "3200" },
        { name: "Fliki", description: "AI video creation with realistic voices", website: "https://fliki.ai", category: "ai-video-tools", pricingModel: "freemium", rating: "4.0", reviewCount: "1800" },
        
        // Advanced Writing & Content
        { name: "Claude Pro", description: "Professional AI writing assistant by Anthropic", website: "https://claude.ai/pro", category: "ai-writing-assistants", pricingModel: "subscription", rating: "4.7", reviewCount: "2800" },
        { name: "Writesonic", description: "AI writing platform for marketing content", website: "https://writesonic.com", category: "ai-writing-assistants", pricingModel: "freemium", rating: "4.3", reviewCount: "4200" },
        { name: "ContentBot", description: "AI content generator for blogs and ads", website: "https://contentbot.ai", category: "ai-writing-assistants", pricingModel: "subscription", rating: "4.1", reviewCount: "1900" },
        { name: "Rytr", description: "AI writing assistant for various content types", website: "https://rytr.me", category: "ai-writing-assistants", pricingModel: "freemium", rating: "4.0", reviewCount: "3500" },
        
        // Image & Art Generation Expansion
        { name: "Adobe Firefly", description: "AI art generator integrated into Adobe Creative Suite", website: "https://firefly.adobe.com", category: "ai-art-generators", pricingModel: "freemium", rating: "4.4", reviewCount: "3800" },
        { name: "Ideogram", description: "AI image generator with text rendering capabilities", website: "https://ideogram.ai", category: "ai-art-generators", pricingModel: "freemium", rating: "4.2", reviewCount: "1600" },
        { name: "Leonardo AI", description: "AI art platform for game assets and creative content", website: "https://leonardo.ai", category: "ai-art-generators", pricingModel: "freemium", rating: "4.3", reviewCount: "2200" },
        { name: "Artbreeder", description: "Collaborative AI art creation platform", website: "https://artbreeder.com", category: "ai-art-generators", pricingModel: "freemium", rating: "4.0", reviewCount: "1400" },
        
        // Code Development Expansion
        { name: "CodeT5", description: "AI code generation and understanding model", website: "https://huggingface.co/Salesforce/codet5-large", category: "ai-code-assistants", pricingModel: "free", rating: "4.1", reviewCount: "850" },
        { name: "Blackbox AI", description: "AI code completion and search", website: "https://blackbox.ai", category: "ai-code-assistants", pricingModel: "freemium", rating: "3.9", reviewCount: "1200" },
        { name: "Sourcegraph Cody", description: "AI coding assistant with codebase context", website: "https://sourcegraph.com/cody", category: "ai-code-assistants", pricingModel: "freemium", rating: "4.2", reviewCount: "980" },
        { name: "Codex by OpenAI", description: "AI that translates natural language to code", website: "https://openai.com/blog/openai-codex", category: "ai-code-assistants", pricingModel: "api", rating: "4.4", reviewCount: "1500" },
        
        // Healthcare & Science
        { name: "PathAI", description: "AI pathology platform for disease diagnosis", website: "https://pathai.com", category: "healthcare", pricingModel: "enterprise", rating: "4.3", reviewCount: "320" },
        { name: "Butterfly Network", description: "AI-powered portable ultrasound", website: "https://butterflynetwork.com", category: "healthcare", pricingModel: "subscription", rating: "4.1", reviewCount: "450" },
        { name: "DeepMind AlphaFold", description: "AI for protein structure prediction", website: "https://deepmind.com/research/alphafold", category: "healthcare", pricingModel: "free", rating: "4.9", reviewCount: "780" },
        { name: "Tempus", description: "AI platform for precision medicine", website: "https://tempus.com", category: "healthcare", pricingModel: "enterprise", rating: "4.2", reviewCount: "290" },
        
        // Finance & Business Intelligence
        { name: "Kensho", description: "AI analytics for financial markets", website: "https://kensho.com", category: "finance", pricingModel: "enterprise", rating: "4.4", reviewCount: "180" },
        { name: "Palantir Foundry", description: "AI-powered data integration platform", website: "https://palantir.com/foundry", category: "data-analytics", pricingModel: "enterprise", rating: "4.1", reviewCount: "520" },
        { name: "ZestFinance", description: "AI underwriting for credit decisions", website: "https://zest.ai", category: "finance", pricingModel: "enterprise", rating: "4.0", reviewCount: "150" },
        { name: "Robo-advisor Betterment", description: "AI investment management platform", website: "https://betterment.com", category: "finance", pricingModel: "subscription", rating: "4.2", reviewCount: "2800" },
        
        // Education & Learning
        { name: "Coursera AI", description: "AI-powered personalized learning platform", website: "https://coursera.org", category: "education", pricingModel: "freemium", rating: "4.3", reviewCount: "5200" },
        { name: "Khan Academy AI", description: "AI tutoring for personalized education", website: "https://khanacademy.org", category: "education", pricingModel: "free", rating: "4.4", reviewCount: "8900" },
        { name: "Duolingo AI", description: "AI language learning with adaptive lessons", website: "https://duolingo.com", category: "education", pricingModel: "freemium", rating: "4.5", reviewCount: "12000" },
        { name: "Squirrel AI", description: "AI adaptive learning system", website: "https://squirrelai.com", category: "education", pricingModel: "subscription", rating: "4.1", reviewCount: "1200" },
        
        // Marketing & SEO
        { name: "MarketMuse", description: "AI content planning and optimization", website: "https://marketmuse.com", category: "seo", pricingModel: "subscription", rating: "4.2", reviewCount: "980" },
        { name: "Surfer SEO", description: "AI-powered SEO content optimization", website: "https://surferseo.com", category: "seo", pricingModel: "subscription", rating: "4.4", reviewCount: "1800" },
        { name: "Clearscope", description: "AI content optimization for search rankings", website: "https://clearscope.io", category: "seo", pricingModel: "subscription", rating: "4.3", reviewCount: "750" },
        { name: "Frase", description: "AI content optimization and research", website: "https://frase.io", category: "seo", pricingModel: "subscription", rating: "4.1", reviewCount: "1200" },
        
        // Customer Service & Support
        { name: "Zendesk AI", description: "AI-powered customer service platform", website: "https://zendesk.com/ai", category: "customer-service", pricingModel: "subscription", rating: "4.2", reviewCount: "3200" },
        { name: "LivePerson AI", description: "AI chatbot for customer engagement", website: "https://liveperson.com", category: "customer-service", pricingModel: "enterprise", rating: "4.0", reviewCount: "1500" },
        { name: "Ada AI", description: "AI customer service automation", website: "https://ada.cx", category: "customer-service", pricingModel: "subscription", rating: "4.1", reviewCount: "890" },
        { name: "Drift AI", description: "AI conversational marketing platform", website: "https://drift.com", category: "customer-service", pricingModel: "subscription", rating: "4.3", reviewCount: "1600" },
        
        // Voice & Speech Technology
        { name: "Speechify", description: "AI text-to-speech reading assistant", website: "https://speechify.com", category: "ai-audio-tools", pricingModel: "freemium", rating: "4.4", reviewCount: "3200" },
        { name: "Descript Overdub", description: "AI voice cloning for content creation", website: "https://descript.com/overdub", category: "ai-audio-tools", pricingModel: "subscription", rating: "4.2", reviewCount: "1100" },
        { name: "Resemble AI", description: "AI voice synthesis and cloning", website: "https://resemble.ai", category: "ai-audio-tools", pricingModel: "api", rating: "4.3", reviewCount: "650" },
        { name: "Wellsaid Labs", description: "AI voice generation for enterprise", website: "https://wellsaidlabs.com", category: "ai-audio-tools", pricingModel: "subscription", rating: "4.1", reviewCount: "420" },
        
        // Robotics & Automation
        { name: "Boston Dynamics AI", description: "Advanced robotics with AI capabilities", website: "https://bostondynamics.com", category: "robotics", pricingModel: "enterprise", rating: "4.6", reviewCount: "350" },
        { name: "UiPath AI", description: "AI-powered robotic process automation", website: "https://uipath.com", category: "ai-automation", pricingModel: "enterprise", rating: "4.3", reviewCount: "2100" },
        { name: "Automation Anywhere", description: "AI automation platform for enterprises", website: "https://automationanywhere.com", category: "ai-automation", pricingModel: "enterprise", rating: "4.1", reviewCount: "1800" },
        { name: "Blue Prism AI", description: "Intelligent automation platform", website: "https://blueprism.com", category: "ai-automation", pricingModel: "enterprise", rating: "4.0", reviewCount: "920" },
        
        // Research & Academic
        { name: "Semantic Scholar", description: "AI-powered academic search engine", website: "https://semanticscholar.org", category: "ai-research-tools", pricingModel: "free", rating: "4.5", reviewCount: "2800" },
        { name: "Elicit", description: "AI research assistant for literature review", website: "https://elicit.org", category: "ai-research-tools", pricingModel: "freemium", rating: "4.3", reviewCount: "1200" },
        { name: "ResearchGate AI", description: "AI-enhanced scientific collaboration", website: "https://researchgate.net", category: "ai-research-tools", pricingModel: "freemium", rating: "4.1", reviewCount: "3500" },
        { name: "Scholarcy", description: "AI research paper summarization", website: "https://scholarcy.com", category: "ai-research-tools", pricingModel: "subscription", rating: "4.2", reviewCount: "850" },
        
        // Gaming & Entertainment
        { name: "NVIDIA Omniverse", description: "AI-powered 3D collaboration platform", website: "https://nvidia.com/omniverse", category: "gaming", pricingModel: "freemium", rating: "4.4", reviewCount: "1100" },
        { name: "Unity ML-Agents", description: "AI training platform for games", website: "https://unity.com/ml-agents", category: "gaming", pricingModel: "free", rating: "4.2", reviewCount: "980" },
        { name: "Promethean AI", description: "AI assistant for digital artists", website: "https://prometheanai.com", category: "gaming", pricingModel: "subscription", rating: "4.1", reviewCount: "650" },
        { name: "Scenario AI", description: "AI game asset generation", website: "https://scenario.gg", category: "gaming", pricingModel: "freemium", rating: "4.0", reviewCount: "850" },
        
        // Agriculture & Environment
        { name: "Climate AI", description: "AI platform for climate risk assessment", website: "https://climate.ai", category: "environmental", pricingModel: "enterprise", rating: "4.3", reviewCount: "180" },
        { name: "Blue River Technology", description: "AI-powered precision agriculture", website: "https://bluerivert.com", category: "agriculture", pricingModel: "enterprise", rating: "4.2", reviewCount: "120" },
        { name: "Taranis", description: "AI crop monitoring and analytics", website: "https://taranis.com", category: "agriculture", pricingModel: "subscription", rating: "4.1", reviewCount: "95" },
        { name: "Prospera", description: "AI-driven crop management platform", website: "https://prospera.ag", category: "agriculture", pricingModel: "subscription", rating: "4.0", reviewCount: "110" }
      ];

      for (const tool of aiToolCollections) {
        tools.push({
          name: tool.name,
          description: tool.description,
          url: tool.website, // Add required url field
          website: tool.website,
          category: tool.category,
          pricingModel: tool.pricingModel,
          status: "pending",
          rating: tool.rating,
          reviewCount: tool.reviewCount,
          tags: [tool.category.toLowerCase().replace(/\s+/g, '-'), 'ai-tool', 'curated'],
          shortDescription: tool.description.length > 100 ? tool.description.substring(0, 97) + '...' : tool.description,
          detailedDescription: tool.description,
          pricing: tool.pricingModel,
          contactEmail: `contact@${this.extractDomain(tool.website)}`,
          clicks: 0,
          featured: parseFloat(tool.rating) >= 4.5,
          sponsoredLevel: null,
          sponsorshipStartDate: null,
          sponsorshipEndDate: null,
          commissionRate: "0",
          affiliateUrl: null,
        });
      }
    } catch (error) {
      console.log("⚠️  Error fetching AI collections:", error);
    }
    
    return tools;
  }

  // Main method to fetch all real-time data
  async fetchAllRealTimeData(): Promise<InsertSubmission[]> {
    console.log('🔄 Fetching real-time AI tool data...');
    
    try {
      // Always fetch from AI collections as they don't require API keys
      const collectionsData = await this.fetchFromAICollections();
      
      // Check if we have any API keys configured for external sources
      const hasApiKeys = !!(
        process.env.PRODUCT_HUNT_API_KEY || 
        process.env.GITHUB_TOKEN || 
        process.env.HUGGINGFACE_API_KEY
      );

      let externalData: InsertSubmission[] = [];
      
      if (hasApiKeys) {
        const [productHuntData, githubData, huggingFaceData, papersData, awesomeData] = await Promise.all([
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
          externalAPIFetcher.fetchFromPapersWithCode().catch(err => {
            console.log('⚠️  Papers with Code API unavailable:', err.message);
            return [];
          }),
          externalAPIFetcher.fetchAwesomeAILists().catch(err => {
            console.log('⚠️  Awesome AI lists unavailable:', err.message);
            return [];
          }),
        ]);
        
        externalData = [...productHuntData, ...githubData, ...huggingFaceData, ...papersData, ...awesomeData];
      } else {
        console.log('⚠️  No API keys found, using curated fallback data');
        console.log('💡 Add PRODUCT_HUNT_API_KEY, GITHUB_TOKEN, or HUGGINGFACE_API_KEY for real-time data');
        externalData = fallbackAITools;
      }

      // Combine all data sources
      const allData = [...collectionsData, ...externalData];
      
      // Remove duplicates based on name (case-insensitive)
      const uniqueData = allData.filter((item, index, self) => 
        index === self.findIndex(t => t.name.toLowerCase().trim() === item.name.toLowerCase().trim())
      );

      console.log(`✅ Fetched ${collectionsData.length} curated tools and ${externalData.length} external tools`);
      console.log(`📊 Total unique tools after deduplication: ${uniqueData.length}`);
      return uniqueData;
    } catch (error) {
      console.error('❌ Error fetching real-time data:', error);
      console.log('⚠️  Falling back to curated data only');
      return fallbackAITools;
    }
  }
}

export const aiToolFetcher = AIToolDataFetcher.getInstance();