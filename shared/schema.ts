import { pgTable, text, serial, integer, boolean, timestamp, decimal, inet, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  url: text("url").notNull(),
  pricing: text("pricing"),
  shortDescription: text("short_description").notNull(),
  detailedDescription: text("detailed_description").notNull(),
  tags: text("tags").array().default([]),
  contactEmail: text("contact_email").notNull(),
  images: text("images").array().default([]),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  rating: decimal("rating", { precision: 2, scale: 1 }),
  reviewCount: integer("review_count").default(0),
  // Monetization fields
  featured: boolean("featured").default(false),
  sponsoredLevel: text("sponsored_level"), // "premium", "gold", "platinum"
  monthlyClicks: integer("monthly_clicks").default(0),
  totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).default("0.00"),
  commissionRate: decimal("commission_rate", { precision: 3, scale: 2 }).default("0.00"), // percentage
  affiliateUrl: text("affiliate_url"),
  promotionalBanner: text("promotional_banner"),
  sponsorshipStartDate: timestamp("sponsorship_start_date"),
  sponsorshipEndDate: timestamp("sponsorship_end_date"),
}, (table) => ({
  nameIdx: index("idx_submissions_name").on(table.name),
  categoryIdx: index("idx_submissions_category").on(table.category),
  statusIdx: index("idx_submissions_status").on(table.status),
  featuredIdx: index("idx_submissions_featured").on(table.featured),
  sponsoredIdx: index("idx_submissions_sponsored").on(table.sponsoredLevel),
}));

// Advertisement space table
export const advertisements = pgTable("advertisements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  targetUrl: text("target_url").notNull(),
  placement: text("placement").notNull(), // "header", "sidebar", "footer", "between-results"
  isActive: boolean("is_active").default(true),
  clickCount: integer("click_count").default(0),
  impressionCount: integer("impression_count").default(0),
  budget: decimal("budget", { precision: 10, scale: 2 }).default("0.00"),
  costPerClick: decimal("cost_per_click", { precision: 5, scale: 2 }).default("0.00"),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  placementIdx: index("idx_advertisements_placement").on(table.placement),
  activeIdx: index("idx_advertisements_active").on(table.isActive),
  startDateIdx: index("idx_advertisements_start_date").on(table.startDate),
  endDateIdx: index("idx_advertisements_end_date").on(table.endDate),
}));

export const searchQueries = pgTable("search_queries", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  categoryFilter: text("category_filter"),
  resultsCount: integer("results_count"),
  createdAt: timestamp("created_at").defaultNow(),
  userIp: inet("user_ip"),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  submissionId: integer("submission_id").references(() => submissions.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  reviewerName: text("reviewer_name"),
  reviewerEmail: text("reviewer_email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const submissionsRelations = relations(submissions, ({ many }) => ({
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  submission: one(submissions, {
    fields: [reviews.submissionId],
    references: [submissions.id],
  }),
}));

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  approvedAt: true,
  rating: true,
  reviewCount: true,
  monthlyClicks: true,
  totalRevenue: true,
}).extend({
  name: z.string().min(1, "Name is required").max(255),
  category: z.enum([
    "ai-tools", 
    "ai-products", 
    "ai-agents",
    "large-language-models",
    "computer-vision",
    "natural-language-processing",
    "machine-learning-platforms",
    "ai-art-generators",
    "ai-video-tools",
    "ai-audio-tools",
    "ai-writing-assistants",
    "ai-code-assistants",
    "ai-data-analytics",
    "ai-automation",
    "ai-chatbots",
    "ai-research-tools",
    "ai-healthcare",
    "ai-finance",
    "ai-education",
    "ai-marketing",
    "ai-productivity",
    "ai-gaming",
    "ai-robotics",
    "ai-infrastructure",
    "ai-design-tools",
    "ai-translation",
    "ai-voice-assistants",
    "ai-content-generation",
    "ai-cybersecurity",
    "ai-ecommerce",
    "ai-real-estate",
    "ai-legal-tech",
    "ai-hr-recruitment",
    "ai-customer-service",
    "ai-social-media",
    "ai-seo-tools",
    "ai-image-editing",
    "ai-3d-modeling",
    "ai-music-generation",
    "ai-speech-recognition",
    "ai-predictive-analytics",
    "ai-recommendation-systems",
    "ai-document-processing",
    "ai-workflow-automation",
    "ai-virtual-assistants",
    "ai-mental-health",
    "ai-fitness-wellness",
    "ai-agriculture",
    "ai-environmental",
    "ai-blockchain",
    "ai-mobile-apps"
  ]),
  url: z.string().url("Invalid URL"),
  shortDescription: z.string().min(10, "Description must be at least 10 characters").max(200),
  detailedDescription: z.string().min(50, "Detailed description must be at least 50 characters"),
  contactEmail: z.string().email("Invalid email address"),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
});

export const insertSearchQuerySchema = createInsertSchema(searchQueries).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
}).extend({
  rating: z.number().min(1).max(5),
  submissionId: z.number().positive(),
});

export const updateSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export const insertAdvertisementSchema = createInsertSchema(advertisements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  clickCount: true,
  impressionCount: true,
}).extend({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  targetUrl: z.string().url("Invalid URL"),
  placement: z.enum(["header", "sidebar", "footer", "between-results"]),
  costPerClick: z.number().min(0).optional(),
  budget: z.number().min(0).optional(),
});

export const updateAdvertisementSchema = createInsertSchema(advertisements).omit({
  id: true,
  createdAt: true,
}).partial();

export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;
export type UpdateSubmission = z.infer<typeof updateSubmissionSchema>;
export type InsertSearchQuery = z.infer<typeof insertSearchQuerySchema>;
export type SearchQuery = typeof searchQueries.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertAdvertisement = z.infer<typeof insertAdvertisementSchema>;
export type Advertisement = typeof advertisements.$inferSelect;
export type UpdateAdvertisement = z.infer<typeof updateAdvertisementSchema>;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;
