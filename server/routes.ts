import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubmissionSchema, insertSearchQuerySchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Admin: Get pending submissions
  app.get("/api/admin/pending", async (req, res) => {
    try {
      const submissions = await storage.getPendingSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Get pending submissions error:", error);
      res.status(500).json({ error: "Failed to get pending submissions" });
    }
  });

  // Admin: Approve submission
  app.post("/api/admin/approve/:id", async (req, res) => {
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
  app.post("/api/admin/reject/:id", async (req, res) => {
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
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getSubmissionStats();
      res.json(stats);
    } catch (error) {
      console.error("Get stats error:", error);
      res.status(500).json({ error: "Failed to get statistics" });
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
