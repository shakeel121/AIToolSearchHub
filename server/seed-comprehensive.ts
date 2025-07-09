#!/usr/bin/env tsx

// Comprehensive seeding script for real AI tools and verified reviews
import { storage } from "./storage";
import { realAITools2025 } from "./real-ai-tools-2025";
import { verifiedReviews } from "./verified-reviews-seed";

async function seedComprehensiveData() {
  console.log('🌟 Starting comprehensive AI tools and reviews seeding...');
  
  // First, seed the real AI tools
  console.log('📊 Seeding real AI tools...');
  let addedToolsCount = 0;
  let skippedToolsCount = 0;
  
  for (const tool of realAITools2025) {
    try {
      // Check if tool already exists by name
      const { submissions } = await storage.getAllSubmissions(1000, 0);
      const existingTool = submissions.find(s => 
        s.name.toLowerCase() === tool.name.toLowerCase() ||
        s.url === tool.url
      );
      
      if (!existingTool) {
        await storage.createSubmission(tool);
        addedToolsCount++;
        console.log(`✅ Added: ${tool.name}`);
      } else {
        skippedToolsCount++;
        console.log(`⏭️  Skipped: ${tool.name} (already exists)`);
      }
    } catch (error) {
      skippedToolsCount++;
      console.error(`❌ Error adding ${tool.name}:`, error.message);
    }
  }
  
  // Then, seed verified reviews
  console.log('\n💬 Seeding verified reviews...');
  let addedReviewsCount = 0;
  let skippedReviewsCount = 0;
  
  // Get updated submissions list
  const { submissions } = await storage.getAllSubmissions(1000, 0);
  const submissionMap = new Map(submissions.map(s => [s.name, s.id]));
  
  // Map of review indices to submission names
  const reviewToSubmissionMap = {
    0: "ChatGPT-4o", 1: "ChatGPT-4o", 2: "ChatGPT-4o",
    3: "Claude 3.5 Sonnet", 4: "Claude 3.5 Sonnet", 5: "Claude 3.5 Sonnet",
    6: "Cursor", 7: "Cursor", 8: "Cursor",
    9: "Midjourney V6", 10: "Midjourney V6", 11: "Midjourney V6",
    12: "Runway Gen-3", 13: "Runway Gen-3",
    14: "Jasper AI", 15: "Jasper AI",
    16: "Perplexity Pro", 17: "Perplexity Pro",
    18: "Suno AI", 19: "Suno AI",
    20: "ElevenLabs", 21: "ElevenLabs"
  };
  
  for (let i = 0; i < verifiedReviews.length; i++) {
    const review = verifiedReviews[i];
    const submissionName = reviewToSubmissionMap[i];
    const submissionId = submissionMap.get(submissionName);
    
    if (submissionId) {
      try {
        await storage.createReview({
          ...review,
          submissionId
        });
        addedReviewsCount++;
        console.log(`✅ Added review for: ${submissionName}`);
      } catch (error) {
        skippedReviewsCount++;
        console.error(`❌ Error adding review for ${submissionName}:`, error.message);
      }
    } else {
      skippedReviewsCount++;
      console.log(`⏭️  Skipped review for: ${submissionName} (submission not found)`);
    }
  }
  
  console.log('\n🎉 Comprehensive seeding complete!');
  console.log('📊 Results:');
  console.log(`   • AI Tools Added: ${addedToolsCount}`);
  console.log(`   • AI Tools Skipped: ${skippedToolsCount}`);
  console.log(`   • Reviews Added: ${addedReviewsCount}`);
  console.log(`   • Reviews Skipped: ${skippedReviewsCount}`);
  console.log(`   • Total Tools Processed: ${realAITools2025.length}`);
  console.log(`   • Total Reviews Processed: ${verifiedReviews.length}`);
  
  process.exit(0);
}

seedComprehensiveData().catch(console.error);