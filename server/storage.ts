import { submissions, searchQueries, reviews, users, sessions, advertisements, type Submission, type InsertSubmission, type SearchQuery, type InsertSearchQuery, type Review, type InsertReview, type User, type InsertUser, type Session, type InsertSession, type Advertisement, type InsertAdvertisement } from "@shared/schema";
import { db } from "./db";
import { eq, ilike, sql, desc, asc, and, or } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Session methods
  createSession(session: InsertSession): Promise<Session>;
  getSession(id: string): Promise<Session | undefined>;
  deleteSession(id: string): Promise<void>;
  
  // Submission methods
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmission(id: number): Promise<Submission | undefined>;
  updateSubmission(id: number, updates: any): Promise<Submission>;
  deleteSubmission(id: number): Promise<void>;
  searchSubmissions(query: string, category?: string, limit?: number, offset?: number): Promise<{ submissions: Submission[]; total: number }>;
  getAllSubmissions(limit?: number, offset?: number): Promise<{ submissions: Submission[]; total: number }>;
  getPendingSubmissions(): Promise<Submission[]>;
  getFeaturedSubmissions(): Promise<Submission[]>;
  getSponsoredSubmissions(): Promise<Submission[]>;
  approveSubmission(id: number): Promise<void>;
  rejectSubmission(id: number): Promise<void>;
  getSubmissionStats(): Promise<{ total: number; approved: number; pending: number; featured: number; sponsored: number }>;
  
  // Search query methods
  logSearchQuery(query: InsertSearchQuery): Promise<SearchQuery>;
  
  // Review methods
  createReview(review: InsertReview): Promise<Review>;
  getReviewsBySubmission(submissionId: number): Promise<Review[]>;
  
  // Advertisement methods
  createAdvertisement(advertisement: InsertAdvertisement): Promise<Advertisement>;
  getAdvertisement(id: number): Promise<Advertisement | undefined>;
  updateAdvertisement(id: number, updates: any): Promise<Advertisement>;
  deleteAdvertisement(id: number): Promise<void>;
  getAdvertisementsByPlacement(placement: string): Promise<Advertisement[]>;
  getActiveAdvertisements(): Promise<Advertisement[]>;
  getAllAdvertisements(): Promise<Advertisement[]>;
  incrementAdClick(id: number): Promise<void>;
  incrementAdImpression(id: number): Promise<void>;
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

  // Session methods
  async createSession(session: InsertSession): Promise<Session> {
    const [created] = await db
      .insert(sessions)
      .values(session)
      .returning();
    return created;
  }

  async getSession(id: string): Promise<Session | undefined> {
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, id));
    return session || undefined;
  }

  async deleteSession(id: string): Promise<void> {
    await db
      .delete(sessions)
      .where(eq(sessions.id, id));
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
    // Build where conditions
    const conditions = [eq(submissions.status, "approved")];
    
    // Add category filter if provided
    if (category) {
      conditions.push(eq(submissions.category, category));
    }

    let baseQuery = db
      .select()
      .from(submissions)
      .where(and(...conditions));

    // If no search query, return all approved submissions
    if (!query || !query.trim()) {
      const [results, countResult] = await Promise.all([
        baseQuery
          .orderBy(desc(submissions.createdAt))
          .limit(limit)
          .offset(offset),
        db
          .select({ count: sql<number>`count(*)` })
          .from(submissions)
          .where(and(...conditions))
      ]);
      
      return {
        submissions: results,
        total: countResult[0]?.count || 0
      };
    }

    // Add text search conditions for queries
    const searchConditions = [
      ...conditions,
      or(
        ilike(submissions.name, `%${query}%`),
        ilike(submissions.shortDescription, `%${query}%`),
        ilike(submissions.detailedDescription, `%${query}%`),
        sql`array_to_string(${submissions.tags}, ' ') ILIKE ${`%${query}%`}`
      )!
    ];

    baseQuery = db
      .select()
      .from(submissions)
      .where(and(...searchConditions));

    const [results, countResult] = await Promise.all([
      baseQuery
        .orderBy(
          sql`CASE 
            WHEN ${submissions.name} ILIKE ${`%${query}%`} THEN 1 
            WHEN ${submissions.shortDescription} ILIKE ${`%${query}%`} THEN 2 
            WHEN ${submissions.detailedDescription} ILIKE ${`%${query}%`} THEN 3
            ELSE 4 
          END`,
          desc(submissions.rating),
          desc(submissions.createdAt)
        )
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(submissions)
        .where(and(...searchConditions))
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

  async getSubmissionStats(): Promise<{ total: number; approved: number; pending: number; featured: number; sponsored: number }> {
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

    const [featuredResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(submissions)
      .where(eq(submissions.featured, true));

    const [sponsoredResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(submissions)
      .where(sql`${submissions.sponsoredLevel} IS NOT NULL`);

    return {
      total: totalResult?.count || 0,
      approved: approvedResult?.count || 0,
      pending: pendingResult?.count || 0,
      featured: featuredResult?.count || 0,
      sponsored: sponsoredResult?.count || 0,
    };
  }

  async updateSubmission(id: number, updates: any): Promise<Submission> {
    const [updated] = await db
      .update(submissions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(submissions.id, id))
      .returning();
    return updated;
  }

  async deleteSubmission(id: number): Promise<void> {
    await db
      .delete(submissions)
      .where(eq(submissions.id, id));
  }

  async getAllSubmissions(limit = 50, offset = 0): Promise<{ submissions: Submission[]; total: number }> {
    const [results, countResult] = await Promise.all([
      db
        .select()
        .from(submissions)
        .orderBy(desc(submissions.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(submissions)
    ]);

    return {
      submissions: results,
      total: countResult[0]?.count || 0
    };
  }

  async getFeaturedSubmissions(): Promise<Submission[]> {
    return await db
      .select()
      .from(submissions)
      .where(and(eq(submissions.status, "approved"), eq(submissions.featured, true)))
      .orderBy(desc(submissions.createdAt));
  }

  async getSponsoredSubmissions(): Promise<Submission[]> {
    return await db
      .select()
      .from(submissions)
      .where(and(
        eq(submissions.status, "approved"),
        sql`${submissions.sponsoredLevel} IS NOT NULL`,
        or(
          sql`${submissions.sponsorshipEndDate} IS NULL`,
          sql`${submissions.sponsorshipEndDate} > NOW()`
        )
      ))
      .orderBy(desc(submissions.createdAt));
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

  // Advertisement methods
  async createAdvertisement(advertisement: InsertAdvertisement): Promise<Advertisement> {
    const [created] = await db
      .insert(advertisements)
      .values({
        ...advertisement,
        budget: advertisement.budget?.toString(),
        costPerClick: advertisement.costPerClick?.toString(),
      })
      .returning();
    return created;
  }

  async getAdvertisement(id: number): Promise<Advertisement | undefined> {
    const [advertisement] = await db
      .select()
      .from(advertisements)
      .where(eq(advertisements.id, id));
    return advertisement || undefined;
  }

  async updateAdvertisement(id: number, updates: any): Promise<Advertisement> {
    const [updated] = await db
      .update(advertisements)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(advertisements.id, id))
      .returning();
    return updated;
  }

  async deleteAdvertisement(id: number): Promise<void> {
    await db
      .delete(advertisements)
      .where(eq(advertisements.id, id));
  }

  async getAdvertisementsByPlacement(placement: string): Promise<Advertisement[]> {
    const now = new Date();
    const results = await db
      .select()
      .from(advertisements)
      .where(
        and(
          eq(advertisements.placement, placement),
          eq(advertisements.isActive, true),
          or(
            sql`${advertisements.endDate} IS NULL`,
            sql`${advertisements.endDate} > ${now}`
          )
        )
      )
      .orderBy(desc(advertisements.createdAt));
    return results;
  }

  async getActiveAdvertisements(): Promise<Advertisement[]> {
    const now = new Date();
    const results = await db
      .select()
      .from(advertisements)
      .where(
        and(
          eq(advertisements.isActive, true),
          or(
            sql`${advertisements.endDate} IS NULL`,
            sql`${advertisements.endDate} > ${now}`
          )
        )
      )
      .orderBy(desc(advertisements.createdAt));
    return results;
  }

  async getAllAdvertisements(): Promise<Advertisement[]> {
    const results = await db
      .select()
      .from(advertisements)
      .orderBy(desc(advertisements.createdAt));
    return results;
  }

  async incrementAdClick(id: number): Promise<void> {
    await db
      .update(advertisements)
      .set({ 
        clickCount: sql`${advertisements.clickCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(advertisements.id, id));
  }

  async incrementAdImpression(id: number): Promise<void> {
    await db
      .update(advertisements)
      .set({ 
        impressionCount: sql`${advertisements.impressionCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(advertisements.id, id));
  }
}

export const storage = new DatabaseStorage();
