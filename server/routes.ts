import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubmissionSchema, insertSearchQuerySchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";
import { seedDatabase } from "./seed";
import { seedComprehensiveData } from "./comprehensive-seed";
import { updateSubmissionSchema } from "@shared/schema";
import { nanoid } from "nanoid";

// Authentication middleware
function requireAuth(req: any, res: any, next: any) {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  if (!sessionId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  // In a real app, validate session from database
  if (sessionId === process.env.ADMIN_SESSION_TOKEN || sessionId === "aisearch-admin-2024") {
    req.user = { role: "admin" };
    next();
  } else {
    res.status(401).json({ error: "Invalid session" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed database on startup
  try {
    await seedDatabase();
    await seedComprehensiveData();
  } catch (error) {
    console.error("Database seeding failed:", error);
  }
  // Search submissions
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string || "";
      const category = req.query.category as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const result = await storage.searchSubmissions(query, category, limit, offset);
      
      // Log search query
      if (query) {
        await storage.logSearchQuery({
          query,
          categoryFilter: category,
          resultsCount: result.total,
          userIp: req.ip
        });
      }

      res.json({
        submissions: result.submissions,
        total: result.total,
        page,
        limit,
        hasMore: offset + limit < result.total
      });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ error: "Search failed" });
    }
  });

  // Submit new tool/product/agent
  app.post("/api/submissions", async (req, res) => {
    try {
      const validatedData = insertSubmissionSchema.parse(req.body);
      const submission = await storage.createSubmission(validatedData);
      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        console.error("Submission creation error:", error);
        res.status(500).json({ error: "Failed to create submission" });
      }
    }
  });

  // Get submission by ID
  app.get("/api/submissions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const submission = await storage.getSubmission(id);
      
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      
      res.json(submission);
    } catch (error) {
      console.error("Get submission error:", error);
      res.status(500).json({ error: "Failed to get submission" });
    }
  });

  // Admin authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (username === "admin" && password === "aisearch2024!") {
        const sessionToken = "aisearch-admin-2024";
        res.json({ 
          success: true, 
          token: sessionToken,
          message: "Authentication successful" 
        });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Admin: Get pending submissions
  app.get("/api/admin/pending", requireAuth, async (req, res) => {
    try {
      const submissions = await storage.getPendingSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Get pending submissions error:", error);
      res.status(500).json({ error: "Failed to get pending submissions" });
    }
  });

  // Admin: Approve submission
  app.post("/api/admin/approve/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.approveSubmission(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Approve submission error:", error);
      res.status(500).json({ error: "Failed to approve submission" });
    }
  });

  // Admin: Reject submission
  app.post("/api/admin/reject/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.rejectSubmission(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Reject submission error:", error);
      res.status(500).json({ error: "Failed to reject submission" });
    }
  });

  // Admin: Get statistics
  app.get("/api/admin/stats", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getSubmissionStats();
      res.json(stats);
    } catch (error) {
      console.error("Get stats error:", error);
      res.status(500).json({ error: "Failed to get statistics" });
    }
  });

  // Get all submissions for admin (paginated)
  app.get("/api/admin/submissions", requireAuth, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = (page - 1) * limit;

      const result = await storage.getAllSubmissions(limit, offset);
      res.json({
        ...result,
        page,
        limit,
        hasMore: offset + limit < result.total
      });
    } catch (error) {
      console.error("Get submissions error:", error);
      res.status(500).json({ error: "Failed to get submissions" });
    }
  });

  // Update submission (admin only)
  app.put("/api/admin/submissions/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = updateSubmissionSchema.parse(req.body);
      
      const updated = await storage.updateSubmission(id, updates);
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        console.error("Update submission error:", error);
        res.status(500).json({ error: "Failed to update submission" });
      }
    }
  });

  // Delete submission (admin only)
  app.delete("/api/admin/submissions/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSubmission(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete submission error:", error);
      res.status(500).json({ error: "Failed to delete submission" });
    }
  });

  // Feature/unfeature submission
  app.post("/api/admin/submissions/:id/feature", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { featured } = req.body;
      
      const updated = await storage.updateSubmission(id, { featured: !!featured });
      res.json(updated);
    } catch (error) {
      console.error("Feature submission error:", error);
      res.status(500).json({ error: "Failed to update featured status" });
    }
  });

  // Set sponsorship level
  app.post("/api/admin/submissions/:id/sponsor", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { sponsoredLevel, sponsorshipStartDate, sponsorshipEndDate, commissionRate, affiliateUrl } = req.body;
      
      const updates: any = {
        sponsoredLevel: sponsoredLevel || null,
        commissionRate: commissionRate || "0.00",
      };

      if (sponsorshipStartDate) updates.sponsorshipStartDate = new Date(sponsorshipStartDate);
      if (sponsorshipEndDate) updates.sponsorshipEndDate = new Date(sponsorshipEndDate);
      if (affiliateUrl) updates.affiliateUrl = affiliateUrl;
      
      const updated = await storage.updateSubmission(id, updates);
      res.json(updated);
    } catch (error) {
      console.error("Sponsor submission error:", error);
      res.status(500).json({ error: "Failed to update sponsorship" });
    }
  });

  // Get featured submissions
  app.get("/api/featured", async (req, res) => {
    try {
      const submissions = await storage.getFeaturedSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Get featured error:", error);
      res.status(500).json({ error: "Failed to get featured submissions" });
    }
  });

  // Get sponsored submissions
  app.get("/api/sponsored", async (req, res) => {
    try {
      const submissions = await storage.getSponsoredSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Get sponsored error:", error);
      res.status(500).json({ error: "Failed to get sponsored submissions" });
    }
  });

  // Track click for monetization
  app.post("/api/track-click/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const submission = await storage.getSubmission(id);
      
      if (submission) {
        await storage.updateSubmission(id, {
          monthlyClicks: (submission.monthlyClicks || 0) + 1
        });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Track click error:", error);
      res.status(500).json({ error: "Failed to track click" });
    }
  });

  // Revenue analytics endpoint
  app.get("/api/admin/analytics", requireAuth, async (req, res) => {
    try {
      const { submissions } = await storage.getAllSubmissions();
      
      const analytics = {
        totalClicks: submissions.reduce((sum, s) => sum + (s.monthlyClicks || 0), 0),
        totalRevenue: submissions.reduce((sum, s) => sum + parseFloat(s.totalRevenue || "0"), 0),
        featuredCount: submissions.filter(s => s.featured).length,
        sponsoredCount: submissions.filter(s => s.sponsoredLevel).length,
        topPerformers: submissions
          .sort((a, b) => (b.monthlyClicks || 0) - (a.monthlyClicks || 0))
          .slice(0, 10)
          .map(s => ({
            id: s.id,
            name: s.name,
            clicks: s.monthlyClicks || 0,
            revenue: parseFloat(s.totalRevenue || "0"),
            category: s.category
          }))
      };
      
      res.json(analytics);
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ error: "Failed to get analytics" });
    }
  });

  // Add review
  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        console.error("Review creation error:", error);
        res.status(500).json({ error: "Failed to create review" });
      }
    }
  });

  // Get reviews for submission
  app.get("/api/reviews/:submissionId", async (req, res) => {
    try {
      const submissionId = parseInt(req.params.submissionId);
      const reviews = await storage.getReviewsBySubmission(submissionId);
      res.json(reviews);
    } catch (error) {
      console.error("Get reviews error:", error);
      res.status(500).json({ error: "Failed to get reviews" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
