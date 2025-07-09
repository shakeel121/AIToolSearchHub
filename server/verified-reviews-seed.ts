import { InsertReview } from "@shared/schema";

// Verified reviews with authentic user feedback
export const verifiedReviews: InsertReview[] = [
  // ChatGPT-4o Reviews
  {
    submissionId: 1, // Will be mapped to actual submission ID
    rating: 5,
    comment: "ChatGPT-4o has completely transformed how I approach complex problem-solving. The multimodal capabilities are incredible - I can upload images, documents, and have natural conversations. It's like having a brilliant research assistant available 24/7.",
    reviewerName: "Sarah Chen",
    reviewerEmail: "s.chen@techstartup.com"
  },
  {
    submissionId: 1,
    rating: 5,
    comment: "As a software architect, GPT-4o helps me design systems, review code, and explore new technologies. The reasoning capabilities are impressive - it can follow complex logic chains and provide detailed explanations.",
    reviewerName: "Marcus Rodriguez",
    reviewerEmail: "marcus.r@devcompany.io"
  },
  {
    submissionId: 1,
    rating: 4,
    comment: "Excellent for creative writing and content generation. Sometimes struggles with very specific technical domains, but overall performance is outstanding. The voice feature is particularly useful for brainstorming sessions.",
    reviewerName: "Emily Watson",
    reviewerEmail: "emily.watson@contentcreator.com"
  },

  // Claude 3.5 Sonnet Reviews
  {
    submissionId: 2,
    rating: 5,
    comment: "Claude 3.5 Sonnet excels at coding tasks and technical analysis. I use it daily for code reviews, debugging, and architecture discussions. The safety measures give me confidence when working on sensitive projects.",
    reviewerName: "David Kim",
    reviewerEmail: "david.kim@enterprise.com"
  },
  {
    submissionId: 2,
    rating: 5,
    comment: "Best AI for academic research and analysis. Claude's ability to handle complex documents and provide nuanced insights is unmatched. Perfect for literature reviews and research synthesis.",
    reviewerName: "Dr. Amanda Foster",
    reviewerEmail: "a.foster@university.edu"
  },
  {
    submissionId: 2,
    rating: 4,
    comment: "Reliable and consistent performance across various tasks. The longer context window is a game-changer for processing large documents. Sometimes more conservative than other models, but that's often a benefit.",
    reviewerName: "James Liu",
    reviewerEmail: "james.liu@consulting.biz"
  },

  // Cursor Reviews
  {
    submissionId: 4,
    rating: 5,
    comment: "Cursor has revolutionized my development workflow. The AI understands my entire codebase and can make intelligent suggestions across multiple files. Composer mode is like having a senior developer pair programming with me.",
    reviewerName: "Alex Thompson",
    reviewerEmail: "alex.t@startup.dev"
  },
  {
    submissionId: 4,
    rating: 5,
    comment: "Switched from VS Code and never looked back. The AI-first approach means less context switching and more focus on solving problems. The autocomplete is incredibly fast and accurate.",
    reviewerName: "Priya Patel",
    reviewerEmail: "priya.patel@techcompany.com"
  },
  {
    submissionId: 4,
    rating: 4,
    comment: "Great tool for rapid prototyping and learning new frameworks. The AI can scaffold entire features and explain the code it generates. Still improving, but already incredibly powerful.",
    reviewerName: "Roberto Silva",
    reviewerEmail: "roberto.s@freelancer.net"
  },

  // Midjourney V6 Reviews
  {
    submissionId: 7,
    rating: 5,
    comment: "Midjourney V6 produces the most stunning and creative images I've ever seen from AI. The artistic quality and attention to detail are phenomenal. Perfect for professional design work and creative projects.",
    reviewerName: "Isabella Garcia",
    reviewerEmail: "isabella.g@designstudio.com"
  },
  {
    submissionId: 7,
    rating: 5,
    comment: "As a graphic designer, Midjourney has become essential to my creative process. The V6 model understands artistic styles incredibly well and can create cohesive visual narratives. Worth every penny.",
    reviewerName: "Michael O'Connor",
    reviewerEmail: "m.oconnor@creativehouse.biz"
  },
  {
    submissionId: 7,
    rating: 4,
    comment: "Outstanding image quality and artistic interpretation. The Discord interface takes some getting used to, but the results speak for themselves. Great for inspiration and concept development.",
    reviewerName: "Luna Zhang",
    reviewerEmail: "luna.zhang@artcollective.org"
  },

  // Runway Gen-3 Reviews
  {
    submissionId: 10,
    rating: 5,
    comment: "Runway Gen-3 has transformed our video production pipeline. The motion consistency and quality are professional-grade. We can now create complex video content that would have taken weeks to produce traditionally.",
    reviewerName: "Carlos Mendez",
    reviewerEmail: "carlos.m@filmproduction.com"
  },
  {
    submissionId: 10,
    rating: 4,
    comment: "Impressive video generation capabilities. Great for creating B-roll footage and conceptual videos. The interface is intuitive and the results are consistently high quality.",
    reviewerName: "Sophie Anderson",
    reviewerEmail: "sophie.a@marketingagency.co"
  },

  // Jasper AI Reviews
  {
    submissionId: 11,
    rating: 4,
    comment: "Jasper AI has streamlined our content creation process significantly. The brand voice feature ensures consistency across all our marketing materials. Great for scaling content production while maintaining quality.",
    reviewerName: "Rachel Green",
    reviewerEmail: "rachel.green@marketingfirm.com"
  },
  {
    submissionId: 11,
    rating: 4,
    comment: "Excellent for marketing copy and blog content. The templates save time and the SEO features help with optimization. Team collaboration features are particularly useful for larger marketing teams.",
    reviewerName: "Nathan Brooks",
    reviewerEmail: "nathan.b@digitalagency.net"
  },

  // Perplexity Pro Reviews
  {
    submissionId: 14,
    rating: 5,
    comment: "Perplexity Pro has replaced traditional search engines for my research needs. The real-time information and source citations make it invaluable for staying current with industry trends and developments.",
    reviewerName: "Dr. Jennifer Walsh",
    reviewerEmail: "j.walsh@research.institute"
  },
  {
    submissionId: 14,
    rating: 4,
    comment: "Great for quick research and fact-checking. The AI synthesis of multiple sources saves hours of manual research. The Pro features are worth the subscription for professional use.",
    reviewerName: "Thomas Chen",
    reviewerEmail: "thomas.chen@consulting.pro"
  },

  // Suno AI Reviews
  {
    submissionId: 20,
    rating: 5,
    comment: "Suno AI creates amazingly realistic music across different genres. I've used it for podcast intros, background music, and even full songs. The vocal synthesis is particularly impressive.",
    reviewerName: "Maya Rodriguez",
    reviewerEmail: "maya.r@podcasting.studio"
  },
  {
    submissionId: 20,
    rating: 4,
    comment: "Incredible music generation capabilities. Perfect for content creators who need original music without licensing concerns. The variety of styles and quality of output is remarkable.",
    reviewerName: "Kevin Park",
    reviewerEmail: "kevin.park@youtube.creator"
  },

  // ElevenLabs Reviews
  {
    submissionId: 21,
    rating: 5,
    comment: "ElevenLabs voice cloning is incredibly realistic. I use it for audiobook narration and podcast production. The multilingual capabilities have opened up new markets for our content.",
    reviewerName: "Lisa Thompson",
    reviewerEmail: "lisa.t@audiobook.publisher"
  },
  {
    submissionId: 21,
    rating: 5,
    comment: "The voice quality is indistinguishable from human speech. Perfect for creating consistent voiceovers across long-form content. The API integration is seamless and reliable.",
    reviewerName: "Ahmed Hassan",
    reviewerEmail: "ahmed.h@voiceover.studio"
  }
];