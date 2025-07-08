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
}, (table) => ({
  nameIdx: index("idx_submissions_name").on(table.name),
  categoryIdx: index("idx_submissions_category").on(table.category),
  statusIdx: index("idx_submissions_status").on(table.status),
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
    "ai-infrastructure"
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

export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;
export type InsertSearchQuery = z.infer<typeof insertSearchQuerySchema>;
export type SearchQuery = typeof searchQueries.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
