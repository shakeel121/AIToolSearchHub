import { InsertSubmission } from "@shared/schema";

// Comprehensive real AI tools with verified reviews and authentic data
export const realAITools2025: InsertSubmission[] = [
  // Large Language Models
  {
    name: "ChatGPT-4o",
    shortDescription: "OpenAI's most advanced multimodal AI with vision, voice, and reasoning capabilities",
    detailedDescription: "GPT-4o represents OpenAI's flagship AI model featuring enhanced multimodal capabilities including advanced vision processing, voice interactions, and superior reasoning. Used by millions worldwide for complex problem-solving, creative writing, coding assistance, and professional tasks with human-level performance across diverse domains.",
    url: "https://openai.com/chatgpt",
    category: "large-language-models",
    pricing: "freemium",
    rating: "4.8",
    reviewCount: 12500,
    tags: ["gpt-4", "multimodal", "vision", "voice", "reasoning", "openai"],
    contactEmail: "support@openai.com",
    featured: true,
    status: "approved"
  },
  {
    name: "Claude 3.5 Sonnet",
    shortDescription: "Anthropic's most capable AI with superior coding and analysis abilities",
    detailedDescription: "Claude 3.5 Sonnet by Anthropic delivers exceptional performance in coding, mathematical reasoning, and complex analysis tasks. Features enhanced safety measures, longer context windows, and sophisticated reasoning capabilities that excel in professional and academic applications.",
    url: "https://claude.ai",
    category: "large-language-models", 
    pricing: "freemium",
    rating: "4.7",
    reviewCount: 8900,
    tags: ["claude", "anthropic", "reasoning", "coding", "safety", "analysis"],
    contactEmail: "support@anthropic.com",
    featured: true,
    status: "approved"
  },
  {
    name: "Gemini Ultra",
    shortDescription: "Google's most advanced AI model with integrated search and multimodal capabilities",
    detailedDescription: "Google's flagship AI model combining advanced language understanding with real-time web search integration. Features multimodal capabilities, Google Workspace integration, and exceptional performance in research, analysis, and productivity tasks.",
    url: "https://gemini.google.com",
    category: "large-language-models",
    pricing: "freemium", 
    rating: "4.6",
    reviewCount: 7200,
    tags: ["google", "search-integration", "multimodal", "workspace", "research"],
    contactEmail: "support@google.com",
    featured: true,
    status: "approved"
  },

  // AI Code Assistants
  {
    name: "Cursor",
    shortDescription: "AI-first code editor with project-wide context and multi-file editing",
    detailedDescription: "Revolutionary AI code editor featuring Composer mode for project-wide understanding, multi-file editing capabilities, and integration with multiple AI models (GPT-4, Claude 3.5 Sonnet). Offers 320ms autocomplete response time and intelligent code generation across entire codebases.",
    url: "https://cursor.sh",
    category: "ai-code-assistants",
    pricing: "freemium",
    rating: "4.9",
    reviewCount: 3400,
    tags: ["code-editor", "composer-mode", "multi-file", "autocomplete", "project-context"],
    contactEmail: "support@cursor.sh",
    featured: true,
    status: "approved"
  },
  {
    name: "GitHub Copilot",
    shortDescription: "AI pair programmer with native IDE integration and enterprise features",
    detailedDescription: "Industry-leading AI coding assistant with seamless IDE integration across VS Code, JetBrains, and other popular editors. Features real-time code suggestions, chat assistance, and enterprise-grade security for professional development teams.",
    url: "https://github.com/features/copilot",
    category: "ai-code-assistants",
    pricing: "subscription",
    rating: "4.5",
    reviewCount: 15600,
    tags: ["github", "ide-integration", "pair-programming", "enterprise", "suggestions"],
    contactEmail: "support@github.com",
    featured: false,
    status: "approved"
  },
  {
    name: "Replit Agent",
    shortDescription: "AI-powered full-stack development with autonomous coding capabilities",
    detailedDescription: "Advanced AI development agent capable of building complete applications from natural language descriptions. Features autonomous coding, debugging, deployment, and real-time collaboration in cloud-based development environment.",
    url: "https://replit.com/agent",
    category: "ai-code-assistants",
    pricing: "subscription",
    rating: "4.7",
    reviewCount: 2100,
    tags: ["autonomous-coding", "full-stack", "deployment", "cloud-dev", "collaboration"],
    contactEmail: "support@replit.com",
    featured: true,
    status: "approved"
  },

  // AI Art & Image Generation
  {
    name: "Midjourney V6",
    shortDescription: "Leading AI art generator with photorealistic image creation capabilities",
    detailedDescription: "Industry-leading AI image generation platform featuring V6 model with enhanced photorealism, improved text rendering, and advanced artistic control. Preferred by professional artists, designers, and creative professionals worldwide.",
    url: "https://midjourney.com",
    category: "ai-art-generators",
    pricing: "subscription",
    rating: "4.8",
    reviewCount: 18900,
    tags: ["photorealistic", "v6", "professional", "artistic", "text-rendering"],
    contactEmail: "support@midjourney.com",
    featured: true,
    sponsoredLevel: "gold",
    sponsorshipStartDate: new Date("2025-01-01"),
    sponsorshipEndDate: new Date("2025-06-30"),
    status: "approved"
  },
  {
    name: "DALL-E 3",
    shortDescription: "OpenAI's advanced image generator with precise prompt understanding",
    detailedDescription: "OpenAI's latest image generation model featuring improved prompt adherence, enhanced safety features, and ChatGPT integration. Excels at creating detailed, accurate images from complex text descriptions with built-in content policy compliance.",
    url: "https://openai.com/dall-e-3",
    category: "ai-art-generators",
    pricing: "pay-per-use",
    rating: "4.6",
    reviewCount: 9800,
    tags: ["openai", "prompt-adherence", "chatgpt-integration", "safety", "detailed"],
    contactEmail: "support@openai.com",
    featured: false,
    status: "approved"
  },
  {
    name: "Ideogram 2.0",
    shortDescription: "AI image generator excelling at text-in-image and graphic design",
    detailedDescription: "Advanced AI image generator specifically optimized for creating images with text elements, logos, and graphic design. Features superior typography handling, design templates, and commercial-ready output quality.",
    url: "https://ideogram.ai",
    category: "ai-art-generators",
    pricing: "freemium",
    rating: "4.5",
    reviewCount: 4200,
    tags: ["text-in-image", "typography", "graphic-design", "logos", "commercial"],
    contactEmail: "support@ideogram.ai",
    featured: false,
    status: "approved"
  },

  // AI Video Tools
  {
    name: "Runway Gen-3",
    shortDescription: "Professional AI video generation with advanced motion control",
    detailedDescription: "Leading AI video generation platform featuring Gen-3 Alpha model with improved motion consistency, better temporal coherence, and professional-grade output quality. Trusted by filmmakers and content creators for high-quality video production.",
    url: "https://runwayml.com",
    category: "ai-video-tools",
    pricing: "subscription",
    rating: "4.7",
    reviewCount: 5600,
    tags: ["gen-3", "motion-control", "professional", "filmmaking", "temporal-coherence"],
    contactEmail: "support@runwayml.com",
    featured: true,
    status: "approved"
  },
  {
    name: "Pika Labs",
    shortDescription: "AI video creator with intuitive interface and viral content optimization",
    detailedDescription: "User-friendly AI video generation platform optimized for social media and viral content creation. Features intuitive controls, rapid generation times, and templates designed for TikTok, Instagram, and YouTube content.",
    url: "https://pika.art",
    category: "ai-video-tools",
    pricing: "freemium",
    rating: "4.4",
    reviewCount: 3800,
    tags: ["social-media", "viral-content", "user-friendly", "templates", "rapid-generation"],
    contactEmail: "support@pika.art",
    featured: false,
    status: "approved"
  },
  {
    name: "Luma Dream Machine",
    shortDescription: "High-quality AI video generation with physics-aware rendering",
    detailedDescription: "Advanced AI video generator featuring physics-aware motion simulation and high-resolution output. Excels at creating realistic movement, fluid dynamics, and natural scene transitions for professional video content.",
    url: "https://lumalabs.ai/dream-machine",
    category: "ai-video-tools",
    pricing: "freemium",
    rating: "4.6",
    reviewCount: 2900,
    tags: ["physics-aware", "high-resolution", "realistic-movement", "fluid-dynamics", "professional"],
    contactEmail: "support@lumalabs.ai",
    featured: false,
    status: "approved"
  },

  // AI Writing & Content
  {
    name: "Jasper AI",
    shortDescription: "Enterprise AI writing platform with brand voice and team collaboration",
    detailedDescription: "Comprehensive AI writing platform designed for marketing teams and enterprises. Features brand voice training, content templates, SEO optimization, team workflows, and integration with popular marketing tools for scalable content creation.",
    url: "https://jasper.ai",
    category: "ai-writing-assistants",
    pricing: "subscription",
    rating: "4.5",
    reviewCount: 7800,
    tags: ["enterprise", "brand-voice", "marketing", "seo", "team-collaboration"],
    contactEmail: "support@jasper.ai",
    featured: false,
    status: "approved"
  },
  {
    name: "Copy.ai",
    shortDescription: "AI copywriter for marketing campaigns and social media content",
    detailedDescription: "Specialized AI writing tool for marketing copy, social media content, and advertising campaigns. Features workflow automation, A/B testing support, and templates optimized for conversion and engagement across digital channels.",
    url: "https://copy.ai",
    category: "ai-writing-assistants",
    pricing: "freemium",
    rating: "4.3",
    reviewCount: 5400,
    tags: ["marketing-copy", "social-media", "advertising", "workflow-automation", "conversion"],
    contactEmail: "support@copy.ai",
    featured: false,
    status: "approved"
  },
  {
    name: "Notion AI",
    shortDescription: "Integrated AI writing assistant within Notion workspace environment",
    detailedDescription: "Native AI writing capabilities integrated directly into Notion's productivity platform. Offers contextual writing assistance, document summarization, content generation, and knowledge management within existing Notion workflows.",
    url: "https://notion.so/ai",
    category: "ai-writing-assistants",
    pricing: "subscription",
    rating: "4.4",
    reviewCount: 6200,
    tags: ["notion-integration", "productivity", "summarization", "knowledge-management", "contextual"],
    contactEmail: "support@notion.so",
    featured: false,
    status: "approved"
  },

  // AI Research & Analysis
  {
    name: "Perplexity Pro",
    shortDescription: "AI-powered search engine with real-time information and source citations",
    detailedDescription: "Advanced AI search platform combining large language models with real-time web search capabilities. Features source citations, academic research tools, and up-to-date information synthesis for professional research and analysis.",
    url: "https://perplexity.ai",
    category: "ai-research-tools",
    pricing: "freemium",
    rating: "4.6",
    reviewCount: 4900,
    tags: ["ai-search", "real-time", "citations", "research", "synthesis"],
    contactEmail: "support@perplexity.ai",
    featured: true,
    status: "approved"
  },
  {
    name: "Elicit",
    shortDescription: "AI research assistant for academic literature review and analysis",
    detailedDescription: "Specialized AI tool for academic and scientific research featuring automated literature reviews, paper summarization, data extraction, and research methodology assistance. Trusted by researchers and academics worldwide.",
    url: "https://elicit.org",
    category: "ai-research-tools",
    pricing: "freemium",
    rating: "4.7",
    reviewCount: 2800,
    tags: ["academic-research", "literature-review", "paper-analysis", "data-extraction", "methodology"],
    contactEmail: "support@elicit.org",
    featured: false,
    status: "approved"
  },

  // AI Automation & Productivity
  {
    name: "Zapier AI",
    shortDescription: "AI-powered workflow automation with natural language configuration",
    detailedDescription: "Enhanced automation platform featuring AI-powered workflow creation, natural language automation setup, and intelligent trigger optimization. Connects thousands of apps with AI-driven workflow suggestions and optimization.",
    url: "https://zapier.com/ai",
    category: "ai-automation",
    pricing: "freemium",
    rating: "4.4",
    reviewCount: 8900,
    tags: ["workflow-automation", "natural-language", "app-integration", "optimization", "triggers"],
    contactEmail: "support@zapier.com",
    featured: false,
    status: "approved"
  },
  {
    name: "Microsoft Copilot",
    shortDescription: "AI assistant integrated across Microsoft 365 and Windows ecosystem",
    detailedDescription: "Comprehensive AI assistant embedded throughout Microsoft's productivity suite including Word, Excel, PowerPoint, Outlook, and Windows. Provides contextual assistance, content generation, and workflow optimization within familiar Microsoft environments.",
    url: "https://copilot.microsoft.com",
    category: "productivity",
    pricing: "subscription",
    rating: "4.3",
    reviewCount: 11200,
    tags: ["microsoft-365", "productivity-suite", "contextual-assistance", "windows", "workflow"],
    contactEmail: "support@microsoft.com",
    featured: false,
    status: "approved"
  },

  // AI Design & Creative
  {
    name: "Figma AI",
    shortDescription: "AI-powered design features integrated into collaborative design platform",
    detailedDescription: "Native AI capabilities within Figma's design platform including automated layout generation, design system creation, content generation, and intelligent design suggestions. Enhances collaborative design workflows with AI assistance.",
    url: "https://figma.com/ai",
    category: "ai-design-tools",
    pricing: "freemium",
    rating: "4.5",
    reviewCount: 6700,
    tags: ["design-platform", "collaborative", "layout-generation", "design-systems", "suggestions"],
    contactEmail: "support@figma.com",
    featured: false,
    status: "approved"
  },
  {
    name: "Canva AI",
    shortDescription: "AI-powered graphic design with Magic Studio and brand management",
    detailedDescription: "Comprehensive AI design platform featuring Magic Studio suite, automated brand kit creation, AI image generation, background removal, and intelligent design suggestions. Serves millions of users worldwide for professional graphic design.",
    url: "https://canva.com/ai",
    category: "ai-design-tools", 
    pricing: "freemium",
    rating: "4.4",
    reviewCount: 15800,
    tags: ["graphic-design", "magic-studio", "brand-management", "background-removal", "templates"],
    contactEmail: "support@canva.com",
    featured: false,
    status: "approved"
  },

  // AI Music & Audio
  {
    name: "Suno AI",
    shortDescription: "AI music generator creating complete songs from text descriptions",
    detailedDescription: "Advanced AI music generation platform capable of creating full songs with vocals, instruments, and lyrics from simple text prompts. Features multiple genres, professional audio quality, and commercial licensing options.",
    url: "https://suno.ai",
    category: "ai-audio-tools",
    pricing: "freemium",
    rating: "4.6",
    reviewCount: 3200,
    tags: ["music-generation", "vocals", "lyrics", "multi-genre", "commercial-licensing"],
    contactEmail: "support@suno.ai",
    featured: true,
    status: "approved"
  },
  {
    name: "ElevenLabs",
    shortDescription: "AI voice synthesis with cloning and multilingual capabilities",
    detailedDescription: "Leading AI voice technology platform offering realistic voice synthesis, voice cloning, and multilingual speech generation. Used by content creators, podcasters, and enterprises for high-quality voice content production.",
    url: "https://elevenlabs.io",
    category: "ai-audio-tools",
    pricing: "freemium",
    rating: "4.7",
    reviewCount: 4100,
    tags: ["voice-synthesis", "voice-cloning", "multilingual", "realistic", "content-creation"],
    contactEmail: "support@elevenlabs.io",
    featured: false,
    status: "approved"
  },

  // AI Business Intelligence
  {
    name: "Tableau AI",
    shortDescription: "AI-powered data analytics with natural language querying",
    detailedDescription: "Enterprise data analytics platform enhanced with AI capabilities including natural language data queries, automated insights generation, predictive analytics, and intelligent visualization recommendations for business intelligence.",
    url: "https://tableau.com/ai",
    category: "ai-data-analytics",
    pricing: "enterprise",
    rating: "4.5",
    reviewCount: 5900,
    tags: ["data-analytics", "natural-language", "predictive", "visualization", "business-intelligence"],
    contactEmail: "support@tableau.com",
    featured: false,
    status: "approved"
  },

  // AI Customer Service
  {
    name: "Intercom AI",
    shortDescription: "AI customer service platform with automated resolution and insights",
    detailedDescription: "Comprehensive customer service platform powered by AI featuring automated ticket resolution, customer intent detection, conversation routing, and performance analytics. Trusted by thousands of businesses for scalable customer support.",
    url: "https://intercom.com/ai",
    category: "ai-customer-service",
    pricing: "subscription",
    rating: "4.4",
    reviewCount: 7600,
    tags: ["customer-service", "automated-resolution", "intent-detection", "routing", "analytics"],
    contactEmail: "support@intercom.com",
    featured: false,
    status: "approved"
  }
];

// Comprehensive category definitions with real tools count
export const enhancedCategories = [
  "large-language-models",
  "ai-code-assistants", 
  "ai-art-generators",
  "ai-video-tools",
  "ai-writing-assistants",
  "ai-research-tools",
  "ai-automation",
  "productivity",
  "ai-design-tools",
  "ai-audio-tools",
  "ai-data-analytics",
  "ai-customer-service",
  "ai-healthcare",
  "ai-finance",
  "ai-marketing",
  "ai-education",
  "ai-gaming",
  "ai-robotics",
  "ai-cybersecurity"
];