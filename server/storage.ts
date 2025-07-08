import { submissions, searchQueries, reviews, users, type Submission, type InsertSubmission, type SearchQuery, type InsertSearchQuery, type Review, type InsertReview, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, ilike, sql, desc, asc, and, or } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Submission methods
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmission(id: number): Promise<Submission | undefined>;
  searchSubmissions(query: string, category?: string, limit?: number, offset?: number): Promise<{ submissions: Submission[]; total: number }>;
  getPendingSubmissions(): Promise<Submission[]>;
  approveSubmission(id: number): Promise<void>;
  rejectSubmission(id: number): Promise<void>;
  getSubmissionStats(): Promise<{ total: number; approved: number; pending: number }>;
  
  // Search query methods
  logSearchQuery(query: InsertSearchQuery): Promise<SearchQuery>;
  
  // Review methods
  createReview(review: InsertReview): Promise<Review>;
  getReviewsBySubmission(submissionId: number): Promise<Review[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Submission methods
  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const [created] = await db
      .insert(submissions)
      .values({
        ...submission,
        status: "pending",
      })
      .returning();
    return created;
  }

  async getSubmission(id: number): Promise<Submission | undefined> {
    const [submission] = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, id));
    return submission || undefined;
  }

  async searchSubmissions(query: string, category?: string, limit = 10, offset = 0): Promise<{ submissions: Submission[]; total: number }> {
    const baseQuery = db
      .select()
      .from(submissions)
      .where(
        and(
          eq(submissions.status, "approved"),
          or(
            ilike(submissions.name, `%${query}%`),
            ilike(submissions.shortDescription, `%${query}%`),
            ilike(submissions.detailedDescription, `%${query}%`),
            sql`array_to_string(${submissions.tags}, ' ') ILIKE ${`%${query}%`}`
          ),
          category ? eq(submissions.category, category) : undefined
        )
      );

    const [results, countResult] = await Promise.all([
      baseQuery
        .orderBy(desc(submissions.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(submissions)
        .where(
          and(
            eq(submissions.status, "approved"),
            or(
              ilike(submissions.name, `%${query}%`),
              ilike(submissions.shortDescription, `%${query}%`),
              ilike(submissions.detailedDescription, `%${query}%`),
              sql`array_to_string(${submissions.tags}, ' ') ILIKE ${`%${query}%`}`
            ),
            category ? eq(submissions.category, category) : undefined
          )
        )
    ]);

    return {
      submissions: results,
      total: countResult[0]?.count || 0
    };
  }

  async getPendingSubmissions(): Promise<Submission[]> {
    return await db
      .select()
      .from(submissions)
      .where(eq(submissions.status, "pending"))
      .orderBy(desc(submissions.createdAt));
  }

  async approveSubmission(id: number): Promise<void> {
    await db
      .update(submissions)
      .set({ 
        status: "approved", 
        approvedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(submissions.id, id));
  }

  async rejectSubmission(id: number): Promise<void> {
    await db
      .update(submissions)
      .set({ 
        status: "rejected",
        updatedAt: new Date()
      })
      .where(eq(submissions.id, id));
  }

  async getSubmissionStats(): Promise<{ total: number; approved: number; pending: number }> {
    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(submissions);

    const [approvedResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(submissions)
      .where(eq(submissions.status, "approved"));

    const [pendingResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(submissions)
      .where(eq(submissions.status, "pending"));

    return {
      total: totalResult?.count || 0,
      approved: approvedResult?.count || 0,
      pending: pendingResult?.count || 0
    };
  }

  // Search query methods
  async logSearchQuery(query: InsertSearchQuery): Promise<SearchQuery> {
    const [created] = await db
      .insert(searchQueries)
      .values(query)
      .returning();
    return created;
  }

  // Review methods
  async createReview(review: InsertReview): Promise<Review> {
    const [created] = await db
      .insert(reviews)
      .values(review)
      .returning();
    return created;
  }

  async getReviewsBySubmission(submissionId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.submissionId, submissionId))
      .orderBy(desc(reviews.createdAt));
  }
}

export const storage = new DatabaseStorage();
