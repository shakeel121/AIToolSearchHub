#!/usr/bin/env tsx

// Manual script to seed enhanced AI tools data
import { storage } from "./storage";
import { enhancedAIToolsData } from "./enhanced-categories-seed-fixed";

async function seedEnhancedData() {
  console.log('🌟 Starting enhanced AI tools seeding...');
  
  let addedCount = 0;
  let skippedCount = 0;
  
  for (const tool of enhancedAIToolsData) {
    try {
      // Check if tool already exists by name or website to avoid duplicates
      const existing = await storage.getAllSubmissions(1000, 0);
      const existingTool = existing.submissions.find(s => 
        s.name.toLowerCase() === tool.name.toLowerCase() ||
        s.website === tool.website
      );
      
      if (!existingTool) {
        await storage.createSubmission(tool);
        console.log(`✅ Added: ${tool.name} (${tool.category})`);
        addedCount++;
      } else {
        console.log(`⏭️  Skipped: ${tool.name} (already exists)`);
        skippedCount++;
      }
    } catch (error) {
      console.error(`❌ Error adding tool ${tool.name}:`, error);
    }
  }
  
  console.log(`\n🎉 Enhanced seeding complete!`);
  console.log(`📊 Results:`);
  console.log(`   • Added: ${addedCount} new tools`);
  console.log(`   • Skipped: ${skippedCount} existing tools`);
  console.log(`   • Total: ${enhancedAIToolsData.length} tools processed`);
}

// Run the seeding
seedEnhancedData().catch(console.error);