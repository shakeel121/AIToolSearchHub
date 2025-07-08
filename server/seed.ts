import { db } from "./db";
import { submissions, users } from "@shared/schema";
import { eq } from "drizzle-orm";

const sampleData = [
  // Large Language Models
  {
    name: "OpenAI GPT-4",
    category: "large-language-models",
    url: "https://openai.com/gpt-4",
    pricing: "paid",
    shortDescription: "Advanced AI language model with superior reasoning capabilities and multimodal understanding.",
    detailedDescription: "GPT-4 is OpenAI's most advanced system, producing safer and more useful responses. It can solve difficult problems with greater accuracy, thanks to its broader general knowledge and problem solving abilities. GPT-4 is more creative and collaborative than ever before. It can generate, edit, and iterate with users on creative and technical writing tasks.",
    tags: ["natural-language", "reasoning", "multimodal", "api"],
    contactEmail: "support@openai.com",
    status: "approved",
    rating: "4.8",
    reviewCount: 1250
  },
  {
    name: "Anthropic Claude",
    category: "large-language-models", 
    url: "https://claude.ai",
    pricing: "freemium",
    shortDescription: "Constitutional AI assistant focused on being helpful, harmless, and honest.",
    detailedDescription: "Claude is an AI assistant created by Anthropic using Constitutional AI techniques. Claude is designed to be helpful, harmless, and honest. It can assist with a wide variety of tasks including analysis, math, coding, creative writing, and thoughtful conversation.",
    tags: ["constitutional-ai", "safety", "reasoning", "analysis"],
    contactEmail: "support@anthropic.com",
    status: "approved",
    rating: "4.7",
    reviewCount: 890
  },
  // Computer Vision
  {
    name: "YOLO (You Only Look Once)",
    category: "computer-vision",
    url: "https://github.com/ultralytics/yolov5",
    pricing: "free",
    shortDescription: "Real-time object detection system with state-of-the-art speed and accuracy.",
    detailedDescription: "YOLO is a family of object detection architectures and models pretrained on the COCO dataset. It represents a completely different approach to object detection. Prior work on object detection repurposes classifiers to perform detection. YOLO frames object detection as a regression problem to spatially separated bounding boxes and associated class probabilities.",
    tags: ["object-detection", "real-time", "computer-vision", "machine-learning"],
    contactEmail: "hello@ultralytics.com",
    status: "approved",
    rating: "4.6",
    reviewCount: 567
  },
  {
    name: "DeepFace",
    category: "computer-vision",
    url: "https://github.com/serengil/deepface",
    pricing: "free",
    shortDescription: "Lightweight face recognition and facial attribute analysis framework.",
    detailedDescription: "DeepFace is a lightweight face recognition and facial attribute analysis (age, gender, emotion and race) framework for python. It is a hybrid face recognition framework wrapping state-of-the-art models: VGG-Face, Google FaceNet, OpenFace, Facebook DeepFace, DeepID, ArcFace, Dlib and SFace.",
    tags: ["face-recognition", "facial-analysis", "python", "deep-learning"],
    contactEmail: "sefik.serengil@gmail.com",
    status: "approved",
    rating: "4.5",
    reviewCount: 423
  },
  // AI Art Generators
  {
    name: "Midjourney",
    category: "ai-art-generators",
    url: "https://midjourney.com",
    pricing: "paid",
    shortDescription: "AI-powered art generator creating stunning visual artwork from text prompts.",
    detailedDescription: "Midjourney is an independent research lab exploring new mediums of thought and expanding the imaginative powers of the human species. We are a small self-funded team focused on design, human infrastructure, and AI.",
    tags: ["text-to-image", "digital-art", "creative", "discord-bot"],
    contactEmail: "support@midjourney.com",
    status: "approved",
    rating: "4.9",
    reviewCount: 2100
  },
  {
    name: "DALL-E 3",
    category: "ai-art-generators",
    url: "https://openai.com/dall-e-3",
    pricing: "paid",
    shortDescription: "OpenAI's advanced image generation model with enhanced prompt adherence.",
    detailedDescription: "DALL·E 3 represents a significant advancement in our ability to generate images that exactly adhere to the text you provide. DALL·E 3 is built natively on ChatGPT, which lets you use ChatGPT as a brainstorming partner and refiner of your prompts.",
    tags: ["text-to-image", "openai", "high-quality", "prompt-adherence"],
    contactEmail: "support@openai.com",
    status: "approved",
    rating: "4.8",
    reviewCount: 1567
  },
  // AI Writing Assistants
  {
    name: "Grammarly",
    category: "ai-writing-assistants",
    url: "https://grammarly.com",
    pricing: "freemium",
    shortDescription: "AI-powered writing assistant for grammar checking, style improvement, and clarity.",
    detailedDescription: "Grammarly's AI-powered products help people communicate more effectively. Millions of users rely on Grammarly every day to make their messages, documents, and social media posts clear, mistake-free, and impactful.",
    tags: ["grammar-check", "writing-improvement", "productivity", "browser-extension"],
    contactEmail: "support@grammarly.com",
    status: "approved",
    rating: "4.6",
    reviewCount: 3200
  },
  {
    name: "Jasper AI",
    category: "ai-writing-assistants",
    url: "https://jasper.ai",
    pricing: "paid",
    shortDescription: "AI content generation platform for marketing copy, blog posts, and creative writing.",
    detailedDescription: "Jasper is the AI Content Platform that helps you and your team break through creative blocks to create amazing, original content 10X faster. Jasper helps teams create high-quality content optimized for better business outcomes.",
    tags: ["content-generation", "marketing", "copywriting", "business"],
    contactEmail: "hello@jasper.ai",
    status: "approved",
    rating: "4.4",
    reviewCount: 890
  },
  // AI Code Assistants
  {
    name: "GitHub Copilot",
    category: "ai-code-assistants",
    url: "https://github.com/features/copilot",
    pricing: "paid",
    shortDescription: "AI pair programmer that helps you write code faster with whole-line & function suggestions.",
    detailedDescription: "GitHub Copilot is an AI pair programmer that helps you write code faster and with less work. It draws context from comments and code, and suggests individual lines and whole functions instantly. GitHub Copilot is powered by OpenAI Codex, a generative pretrained language model created by OpenAI.",
    tags: ["code-completion", "programming", "github", "productivity"],
    contactEmail: "support@github.com",
    status: "approved",
    rating: "4.7",
    reviewCount: 2800
  },
  {
    name: "Tabnine",
    category: "ai-code-assistants",
    url: "https://tabnine.com",
    pricing: "freemium",
    shortDescription: "AI assistant for software developers with personalized code completions.",
    detailedDescription: "Tabnine is an AI assistant that speeds up delivery and keeps your code safe. It provides personalized code completions for all the popular coding languages and IDEs. Tabnine learns your coding patterns and suggests completions based on your codebase.",
    tags: ["code-completion", "ide-integration", "personalized", "privacy"],
    contactEmail: "support@tabnine.com",
    status: "approved",
    rating: "4.5",
    reviewCount: 1100
  },
  // AI Chatbots
  {
    name: "ChatGPT",
    category: "ai-chatbots",
    url: "https://chat.openai.com",
    pricing: "freemium",
    shortDescription: "Conversational AI chatbot capable of understanding and responding to complex queries.",
    detailedDescription: "ChatGPT is a sibling model to InstructGPT, which is trained to follow an instruction in a prompt and provide a detailed response. ChatGPT is optimized for dialogue and can answer followup questions, admit its mistakes, challenge incorrect premises, and reject inappropriate requests.",
    tags: ["conversational-ai", "chat", "question-answering", "general-purpose"],
    contactEmail: "support@openai.com",
    status: "approved",
    rating: "4.8",
    reviewCount: 4500
  },
  // AI Healthcare
  {
    name: "IBM Watson Health",
    category: "ai-healthcare",
    url: "https://www.ibm.com/watson-health",
    pricing: "api",
    shortDescription: "AI-powered healthcare solutions for clinical decision support and medical imaging.",
    detailedDescription: "IBM Watson Health helps healthcare organizations improve care by providing AI-powered insights from health data. The platform supports clinical decision making, medical imaging analysis, drug discovery, and population health management.",
    tags: ["clinical-ai", "medical-imaging", "healthcare-analytics", "enterprise"],
    contactEmail: "watson@ibm.com",
    status: "approved",
    rating: "4.3",
    reviewCount: 234
  },
  // AI Finance
  {
    name: "Kensho Technologies",
    category: "ai-finance",
    url: "https://kensho.com",
    pricing: "api",
    shortDescription: "AI analytics platform for financial markets and risk assessment.",
    detailedDescription: "Kensho deploys machine learning and analytics to transform financial institutions. Their solutions span from speech recognition for earnings calls to natural language processing for document analysis and quantitative analytics for market prediction.",
    tags: ["financial-analytics", "risk-assessment", "market-prediction", "fintech"],
    contactEmail: "info@kensho.com",
    status: "approved",
    rating: "4.4",
    reviewCount: 156
  },
  // AI Productivity
  {
    name: "Notion AI",
    category: "ai-productivity",
    url: "https://notion.so/product/ai",
    pricing: "paid",
    shortDescription: "AI-powered writing assistant integrated into Notion workspace for enhanced productivity.",
    detailedDescription: "Notion AI helps you write better, faster, and more creatively. Use AI to generate summaries, action items, and insights from your meetings. Write and brainstorm with an AI thought partner that knows your work and adapts to your voice.",
    tags: ["productivity", "writing-assistant", "workspace", "collaboration"],
    contactEmail: "team@notion.so",
    status: "approved",
    rating: "4.6",
    reviewCount: 987
  },
  // AI Video Tools
  {
    name: "RunwayML",
    category: "ai-video-tools",
    url: "https://runwayml.com",
    pricing: "freemium",
    shortDescription: "AI-powered video editing and generation platform for creators and filmmakers.",
    detailedDescription: "Runway is an applied AI research company shaping the next era of art, entertainment and human creativity. Runway builds tools that enable new forms of creative expression and accelerate the creative process.",
    tags: ["video-generation", "video-editing", "creative-tools", "machine-learning"],
    contactEmail: "hello@runwayml.com",
    status: "approved",
    rating: "4.7",
    reviewCount: 678
  },
  // AI Data Analytics
  {
    name: "DataRobot",
    category: "ai-data-analytics",
    url: "https://datarobot.com",
    pricing: "api",
    shortDescription: "Enterprise AI platform for automated machine learning and predictive analytics.",
    detailedDescription: "DataRobot delivers AI technology at enterprise scale. The platform automates machine learning workflows, making it easier for organizations to build, deploy, and maintain AI applications for business outcomes.",
    tags: ["automl", "predictive-analytics", "enterprise", "machine-learning"],
    contactEmail: "info@datarobot.com",
    status: "approved",
    rating: "4.5",
    reviewCount: 312
  }
];

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Create admin user
    const adminExists = await db.select().from(users).where(eq(users.username, "admin"));
    if (adminExists.length === 0) {
      await db.insert(users).values({
        username: "admin",
        password: "aisearch2024!", // In production, this should be hashed
        role: "admin"
      });
      console.log("✅ Admin user created");
    }

    // Check if we already have data
    const existingSubmissions = await db.select().from(submissions).limit(1);
    if (existingSubmissions.length > 0) {
      console.log("📊 Database already contains data, skipping seed");
      return;
    }

    // Insert sample submissions
    for (const submission of sampleData) {
      await db.insert(submissions).values({
        ...submission,
        approvedAt: new Date(),
        updatedAt: new Date()
      });
    }

    console.log(`✅ Successfully seeded ${sampleData.length} AI tools`);
    console.log("🎉 Database seeding completed!");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}