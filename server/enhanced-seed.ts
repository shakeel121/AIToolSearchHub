import { db } from "./db";
import { submissions, advertisements } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedEnhancedData() {
  console.log("🚀 Starting enhanced database seeding...");

  try {
    // Check if we already have enhanced data
    const existingCount = await db.select().from(submissions);
    if (existingCount.length > 20) {
      console.log("📊 Database already contains enhanced data, skipping seed");
      return;
    }

    // Enhanced AI tools across all new categories
    const enhancedSubmissions = [
      // AI Design Tools
      {
        name: "Figma AI",
        category: "ai-design-tools",
        url: "https://figma.com/ai",
        pricing: "freemium",
        shortDescription: "AI-powered design assistant for creating stunning user interfaces and prototypes.",
        detailedDescription: "Figma AI revolutionizes the design process by providing intelligent suggestions, auto-layout features, and design pattern recognition to help designers create better interfaces faster.",
        tags: ["design", "ui-ux", "prototyping", "collaboration"],
        contactEmail: "ai@figma.com",
        status: "approved",
        rating: "4.7",
        reviewCount: 1250,
      },
      {
        name: "Canva Magic Design",
        category: "ai-design-tools",
        url: "https://canva.com/magic",
        pricing: "freemium",
        shortDescription: "AI design generator that creates professional graphics, presentations, and social media content.",
        detailedDescription: "Canva's Magic Design uses AI to instantly generate custom designs based on your content and preferences, making professional design accessible to everyone.",
        tags: ["graphics", "social-media", "presentations", "branding"],
        contactEmail: "support@canva.com",
        status: "approved",
        rating: "4.6",
        reviewCount: 890,
      },

      // AI Translation
      {
        name: "DeepL Translator",
        category: "ai-translation",
        url: "https://deepl.com",
        pricing: "freemium",
        shortDescription: "Advanced AI translator that provides nuanced, context-aware translations.",
        detailedDescription: "DeepL uses advanced neural networks to deliver translations that capture subtle meanings and context, making it the preferred choice for professional translation needs.",
        tags: ["translation", "language", "communication", "business"],
        contactEmail: "support@deepl.com",
        status: "approved",
        rating: "4.8",
        reviewCount: 2100,
      },
      {
        name: "Google Translate AI",
        category: "ai-translation",
        url: "https://translate.google.com",
        pricing: "free",
        shortDescription: "Real-time AI translation supporting over 100 languages with camera and voice input.",
        detailedDescription: "Google Translate leverages advanced neural machine translation to provide instant translations across text, speech, images, and real-time conversations.",
        tags: ["translation", "mobile", "real-time", "multilingual"],
        contactEmail: "translate@google.com",
        status: "approved",
        rating: "4.5",
        reviewCount: 5600,
      },

      // AI Voice Assistants
      {
        name: "Amazon Alexa",
        category: "ai-voice-assistants",
        url: "https://alexa.amazon.com",
        pricing: "free",
        shortDescription: "Cloud-based voice service that powers smart devices and voice interactions.",
        detailedDescription: "Alexa provides voice-controlled smart home automation, entertainment, information, and thousands of skills for everyday tasks and business applications.",
        tags: ["voice-control", "smart-home", "automation", "skills"],
        contactEmail: "alexa@amazon.com",
        status: "approved",
        rating: "4.4",
        reviewCount: 3200,
      },
      {
        name: "Google Assistant",
        category: "ai-voice-assistants",
        url: "https://assistant.google.com",
        pricing: "free",
        shortDescription: "AI-powered virtual assistant for hands-free help across devices.",
        detailedDescription: "Google Assistant helps you get things done using natural conversation, connecting to your Google services and smart devices for seamless voice control.",
        tags: ["voice-assistant", "google-integration", "mobile", "smart-devices"],
        contactEmail: "assistant@google.com",
        status: "approved",
        rating: "4.5",
        reviewCount: 4100,
      },

      // AI Content Generation
      {
        name: "Copy.ai",
        category: "ai-content-generation",
        url: "https://copy.ai",
        pricing: "freemium",
        shortDescription: "AI-powered copywriting tool for marketing content, blogs, and social media.",
        detailedDescription: "Copy.ai helps marketers and content creators generate high-converting copy for ads, emails, blogs, and social media using advanced language models.",
        tags: ["copywriting", "marketing", "content-creation", "seo"],
        contactEmail: "hello@copy.ai",
        status: "approved",
        rating: "4.3",
        reviewCount: 780,
      },
      {
        name: "Writesonic",
        category: "ai-content-generation",
        url: "https://writesonic.com",
        pricing: "freemium",
        shortDescription: "AI content generator for articles, ads, product descriptions, and more.",
        detailedDescription: "Writesonic provides AI-powered content generation for various formats including long-form articles, ad copy, product descriptions, and landing page content.",
        tags: ["content-writing", "marketing", "seo", "e-commerce"],
        contactEmail: "support@writesonic.com",
        status: "approved",
        rating: "4.4",
        reviewCount: 650,
      },

      // AI Cybersecurity
      {
        name: "Darktrace",
        category: "ai-cybersecurity",
        url: "https://darktrace.com",
        pricing: "enterprise",
        shortDescription: "AI cyber defense platform that detects and responds to threats in real-time.",
        detailedDescription: "Darktrace's Enterprise Immune System uses AI to understand normal network behavior and autonomously respond to cyber threats before they cause damage.",
        tags: ["cybersecurity", "threat-detection", "enterprise", "autonomous-response"],
        contactEmail: "info@darktrace.com",
        status: "approved",
        rating: "4.6",
        reviewCount: 340,
      },
      {
        name: "CrowdStrike Falcon",
        category: "ai-cybersecurity",
        url: "https://crowdstrike.com/falcon",
        pricing: "enterprise",
        shortDescription: "Cloud-native endpoint protection powered by AI and threat intelligence.",
        detailedDescription: "CrowdStrike Falcon uses AI-powered threat detection and response to protect endpoints, workloads, and data across hybrid cloud environments.",
        tags: ["endpoint-protection", "cloud-security", "threat-intelligence", "enterprise"],
        contactEmail: "info@crowdstrike.com",
        status: "approved",
        rating: "4.7",
        reviewCount: 520,
      },

      // AI E-commerce
      {
        name: "Shopify Magic",
        category: "ai-ecommerce",
        url: "https://shopify.com/magic",
        pricing: "paid",
        shortDescription: "AI suite for e-commerce automation, content generation, and customer insights.",
        detailedDescription: "Shopify Magic provides AI-powered tools for product descriptions, email marketing, customer service, and business insights to help merchants grow their online stores.",
        tags: ["e-commerce", "automation", "customer-service", "analytics"],
        contactEmail: "magic@shopify.com",
        status: "approved",
        rating: "4.5",
        reviewCount: 1100,
      },

      // AI Real Estate
      {
        name: "Zillow Instant Offers",
        category: "ai-real-estate",
        url: "https://zillow.com/instant-offers",
        pricing: "free",
        shortDescription: "AI-powered home valuation and instant cash offers for real estate.",
        detailedDescription: "Zillow's AI algorithms analyze market data, property features, and local trends to provide accurate home valuations and instant purchase offers.",
        tags: ["real-estate", "valuation", "market-analysis", "property"],
        contactEmail: "instantoffers@zillow.com",
        status: "approved",
        rating: "4.2",
        reviewCount: 890,
      },

      // AI Legal Tech
      {
        name: "LegalZoom AI",
        category: "ai-legal-tech",
        url: "https://legalzoom.com/ai",
        pricing: "paid",
        shortDescription: "AI-powered legal document generation and business formation assistance.",
        detailedDescription: "LegalZoom AI streamlines legal document creation, business formation, and compliance tasks using intelligent automation and legal expertise.",
        tags: ["legal-documents", "business-formation", "compliance", "automation"],
        contactEmail: "ai@legalzoom.com",
        status: "approved",
        rating: "4.3",
        reviewCount: 670,
      },

      // AI HR & Recruitment
      {
        name: "HireVue",
        category: "ai-hr-recruitment",
        url: "https://hirevue.com",
        pricing: "enterprise",
        shortDescription: "AI-powered video interviewing and talent assessment platform.",
        detailedDescription: "HireVue uses AI to analyze video interviews, assess candidate skills, and predict job performance to help companies make better hiring decisions.",
        tags: ["recruitment", "video-interviews", "talent-assessment", "hr-analytics"],
        contactEmail: "info@hirevue.com",
        status: "approved",
        rating: "4.1",
        reviewCount: 450,
      },

      // AI Customer Service
      {
        name: "Zendesk Answer Bot",
        category: "ai-customer-service",
        url: "https://zendesk.com/answer-bot",
        pricing: "paid",
        shortDescription: "AI chatbot that provides instant customer support and ticket resolution.",
        detailedDescription: "Zendesk Answer Bot uses machine learning to understand customer inquiries and provide relevant answers from your knowledge base, reducing support ticket volume.",
        tags: ["customer-support", "chatbot", "ticket-automation", "knowledge-base"],
        contactEmail: "answerbot@zendesk.com",
        status: "approved",
        rating: "4.4",
        reviewCount: 780,
      },

      // AI Social Media
      {
        name: "Hootsuite Insights",
        category: "ai-social-media",
        url: "https://hootsuite.com/insights",
        pricing: "paid",
        shortDescription: "AI-powered social media analytics and content optimization platform.",
        detailedDescription: "Hootsuite Insights uses AI to analyze social media performance, identify trending topics, and optimize content strategy across multiple platforms.",
        tags: ["social-media", "analytics", "content-optimization", "trend-analysis"],
        contactEmail: "insights@hootsuite.com",
        status: "approved",
        rating: "4.3",
        reviewCount: 590,
      },

      // AI SEO Tools
      {
        name: "Surfer SEO",
        category: "ai-seo-tools",
        url: "https://surferseo.com",
        pricing: "paid",
        shortDescription: "AI-driven SEO optimization tool for content creation and ranking improvement.",
        detailedDescription: "Surfer SEO analyzes top-ranking pages and provides AI-powered recommendations for content optimization, keyword research, and SERP analysis.",
        tags: ["seo", "content-optimization", "keyword-research", "serp-analysis"],
        contactEmail: "support@surferseo.com",
        status: "approved",
        rating: "4.6",
        reviewCount: 820,
      },

      // AI 3D Modeling
      {
        name: "Blender AI",
        category: "ai-3d-modeling",
        url: "https://blender.org/ai",
        pricing: "free",
        shortDescription: "Open-source 3D creation suite with AI-enhanced modeling and rendering.",
        detailedDescription: "Blender's AI features include intelligent mesh generation, automated rigging, procedural texturing, and AI-assisted animation for professional 3D content creation.",
        tags: ["3d-modeling", "animation", "rendering", "open-source"],
        contactEmail: "ai@blender.org",
        status: "approved",
        rating: "4.5",
        reviewCount: 1200,
      },

      // AI Music Generation
      {
        name: "AIVA",
        category: "ai-music-generation",
        url: "https://aiva.ai",
        pricing: "freemium",
        shortDescription: "AI composer that creates original music for films, games, and commercials.",
        detailedDescription: "AIVA uses deep learning to compose emotional soundtrack music in various styles, helping content creators add professional music to their projects.",
        tags: ["music-composition", "soundtrack", "film-scoring", "creative-ai"],
        contactEmail: "hello@aiva.ai",
        status: "approved",
        rating: "4.4",
        reviewCount: 380,
      },

      // AI Agriculture
      {
        name: "John Deere AI",
        category: "ai-agriculture",
        url: "https://johndeere.com/ai",
        pricing: "enterprise",
        shortDescription: "Precision agriculture AI for crop monitoring, yield optimization, and farm automation.",
        detailedDescription: "John Deere's AI solutions provide real-time crop monitoring, predictive analytics for yield optimization, and autonomous farming equipment operation.",
        tags: ["precision-agriculture", "crop-monitoring", "farm-automation", "yield-optimization"],
        contactEmail: "ai@johndeere.com",
        status: "approved",
        rating: "4.3",
        reviewCount: 290,
      },

      // AI Environmental
      {
        name: "Carbon AI",
        category: "ai-environmental",
        url: "https://carbon.ai",
        pricing: "enterprise",
        shortDescription: "AI platform for carbon footprint tracking and environmental impact analysis.",
        detailedDescription: "Carbon AI helps organizations measure, track, and reduce their carbon footprint using machine learning algorithms and environmental data analysis.",
        tags: ["carbon-tracking", "sustainability", "environmental-impact", "esg"],
        contactEmail: "info@carbon.ai",
        status: "approved",
        rating: "4.2",
        reviewCount: 180,
      },
    ];

    // Insert enhanced submissions
    for (const submission of enhancedSubmissions) {
      await db.insert(submissions).values({
        ...submission,
        images: [],
        approvedAt: new Date(),
      });
    }

    // Create sample advertisements
    const sampleAdvertisements = [
      {
        title: "Boost Your AI Development",
        description: "Get 50% off premium AI development tools and accelerate your projects with cutting-edge technology.",
        imageUrl: "/ads/ai-development-tools.jpg",
        targetUrl: "https://example.com/ai-tools-offer",
        placement: "header",
        isActive: true,
        budget: "1000.00",
        costPerClick: "2.50",
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      {
        title: "Master AI with Expert Courses",
        description: "Learn from industry experts and transform your career with comprehensive AI and machine learning courses.",
        imageUrl: "/ads/ai-courses.jpg",
        targetUrl: "https://example.com/ai-courses",
        placement: "sidebar",
        isActive: true,
        budget: "500.00",
        costPerClick: "1.75",
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      },
      {
        title: "Enterprise AI Solutions",
        description: "Scale your business with enterprise-grade AI solutions. Custom implementation and 24/7 support included.",
        imageUrl: "/ads/enterprise-ai.jpg",
        targetUrl: "https://example.com/enterprise-ai",
        placement: "between-results",
        isActive: true,
        budget: "2000.00",
        costPerClick: "5.00",
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      },
      {
        title: "AI Startup Accelerator",
        description: "Join the next generation of AI startups. Get funding, mentorship, and resources to build the future.",
        imageUrl: "/ads/ai-startup.jpg",
        targetUrl: "https://example.com/ai-accelerator",
        placement: "footer",
        isActive: true,
        budget: "750.00",
        costPerClick: "3.25",
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      },
    ];

    // Insert sample advertisements
    for (const ad of sampleAdvertisements) {
      await db.insert(advertisements).values(ad);
    }

    console.log(`✅ Successfully seeded ${enhancedSubmissions.length} enhanced AI tools`);
    console.log(`✅ Successfully seeded ${sampleAdvertisements.length} sample advertisements`);
    console.log("🎉 Enhanced database seeding completed!");

  } catch (error) {
    console.error("❌ Enhanced seeding error:", error);
    throw error;
  }
}