import { submissions, searchQueries, reviews, users, sessions, advertisements, type Submission, type InsertSubmission, type SearchQuery, type InsertSearchQuery, type Review, type InsertReview, type User, type InsertUser, type Session, type InsertSession, type Advertisement, type InsertAdvertisement } from "@shared/schema";
import { db } from "./db";
import { eq, ilike, sql, desc, asc, and, or } from "drizzle-orm";
import { aiSearchEngine } from "./ai-search-engine";

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
  searchSubmissions(query: string, category?: string, limit?: number, offset?: number): Promise<{ submissions: Submission[]; total: number; metrics?: any }>;
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
    // Check if submission with same name already exists (case-insensitive)
    const existing = await db
      .select()
      .from(submissions)
      .where(sql`LOWER(TRIM(${submissions.name})) = LOWER(TRIM(${submission.name}))`)
      .limit(1);
    
    if (existing.length > 0) {
      console.log(`⚠️  Skipping duplicate submission: ${submission.name}`);
      return existing[0];
    }
    
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

  async searchSubmissions(query: string, category?: string, limit = 10, offset = 0): Promise<{ submissions: Submission[]; total: number; metrics?: any }> {
    const startTime = Date.now();
    
    // Get all approved submissions for AI processing
    const conditions = [eq(submissions.status, "approved")];
    if (category && category !== 'all') {
      conditions.push(eq(submissions.category, category));
    }

    const allSubmissions = await db
      .select()
      .from(submissions)
      .where(and(...conditions));

    // If no search query, return smart-ordered results
    if (!query || !query.trim()) {
      const sorted = allSubmissions.sort((a, b) => {
        // Priority: Featured > Sponsored > Rating > Recent
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        
        const aSponsorPriority = a.sponsoredLevel === 'platinum' ? 3 : a.sponsoredLevel === 'gold' ? 2 : a.sponsoredLevel === 'premium' ? 1 : 0;
        const bSponsorPriority = b.sponsoredLevel === 'platinum' ? 3 : b.sponsoredLevel === 'gold' ? 2 : b.sponsoredLevel === 'premium' ? 1 : 0;
        if (aSponsorPriority !== bSponsorPriority) return bSponsorPriority - aSponsorPriority;
        
        const aRating = parseFloat(a.rating || '0');
        const bRating = parseFloat(b.rating || '0');
        if (aRating !== bRating) return bRating - aRating;
        
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      const paginatedResults = sorted.slice(offset, offset + limit);
      
      return {
        submissions: paginatedResults,
        total: sorted.length,
        metrics: {
          processingTime: Date.now() - startTime,
          algorithmUsed: 'smart_sorting',
          totalScanned: allSubmissions.length
        }
      };
    }

    // Use AI-powered search engine for advanced search
    const searchResult = aiSearchEngine.enhancedSearch(allSubmissions, query, {
      category: category && category !== 'all' ? category : undefined
    });

    // Apply pagination
    const paginatedResults = searchResult.results.slice(offset, offset + limit);

    return {
      submissions: paginatedResults,
      total: searchResult.results.length,
      metrics: {
        ...searchResult.metrics,
        processingTime: Date.now() - startTime,
        query: query,
        category: category || null,
        pagination: {
          offset,
          limit,
          totalPages: Math.ceil(searchResult.results.length / limit)
        }
      }
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
