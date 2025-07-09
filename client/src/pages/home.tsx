import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Star, Crown, TrendingUp, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SearchResults from "@/components/search-results";
import AdvertisementBanner from "@/components/advertisement-banner";
import { SearchAutoSuggest } from "@/components/search-auto-suggest";
import { apiRequest } from "@/lib/queryClient";

const categories = [
  { label: "Large Language Models", value: "large-language-models" },
  { label: "Computer Vision", value: "computer-vision" },
  { label: "Natural Language Processing", value: "natural-language-processing" },
  { label: "Machine Learning Platforms", value: "machine-learning-platforms" },
  { label: "AI Art Generators", value: "ai-art-generators" },
  { label: "Video Generation", value: "video-generation" },
  { label: "Audio Tools", value: "audio-tools" },
  { label: "Writing Assistants", value: "writing-assistants" },
  { label: "Code Assistants", value: "code-assistants" },
  { label: "Data Analytics", value: "data-analytics" },
  { label: "Healthcare AI", value: "healthcare-ai" },
  { label: "Finance AI", value: "finance-ai" },
  { label: "Education AI", value: "education-ai" },
  { label: "Marketing AI", value: "marketing-ai" },
  { label: "Automation Tools", value: "automation-tools" },
  { label: "Chatbots", value: "chatbots" },
  { label: "Research Tools", value: "research-tools" },
  { label: "Productivity", value: "productivity" },
  { label: "Gaming AI", value: "gaming-ai" },
  { label: "Robotics", value: "robotics" },
  { label: "AI Infrastructure", value: "ai-infrastructure" },
  { label: "Content Creation", value: "content-creation" },
  { label: "Search & Discovery", value: "search-discovery" },
  { label: "Personalization", value: "personalization" },
  { label: "Design Tools", value: "ai-design-tools" },
  { label: "Translation", value: "ai-translation" },
  { label: "Voice Assistants", value: "voice-assistants" },
  { label: "3D Modeling", value: "ai-3d-modeling" },
  { label: "Music Generation", value: "ai-music-generation" },
  { label: "Legal Tech", value: "ai-legal-tech" },
  { label: "Real Estate", value: "ai-real-estate" },
  { label: "Agriculture", value: "ai-agriculture" },
  { label: "Customer Service", value: "ai-customer-service" },
  { label: "HR & Recruitment", value: "ai-hr-recruitment" },
  { label: "Cybersecurity", value: "ai-cybersecurity" },
  { label: "Environmental", value: "ai-environmental" },
  { label: "E-commerce", value: "ai-ecommerce" },
  { label: "Social Media", value: "ai-social-media" },
  { label: "SEO Tools", value: "ai-seo-tools" }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [isSearching, setIsSearching] = useState(false);
  const [useAdvancedSearch, setUseAdvancedSearch] = useState(false);

  const getCategoryLabel = (value: string) => {
    return categories.find(cat => cat.value === value)?.label || value;
  };

  // Fetch featured and sponsored content for homepage
  const { data: featuredSubmissions } = useQuery({
    queryKey: ["/api/featured"],
    queryFn: () => apiRequest("GET", "/api/featured").then(res => res.json())
  });

  const { data: sponsoredSubmissions } = useQuery({
    queryKey: ["/api/sponsored"],
    queryFn: () => apiRequest("GET", "/api/sponsored").then(res => res.json())
  });

  // Fetch latest AI tools with verified reviews
  const { data: latestTools } = useQuery({
    queryKey: ["/api/submissions", "latest"],
    queryFn: () => apiRequest("GET", "/api/submissions?limit=12&sort=latest").then(res => res.json())
  });

  // Fetch trending tools by category
  const { data: trendingByCategory } = useQuery({
    queryKey: ["/api/submissions", "trending"],
    queryFn: () => apiRequest("GET", "/api/submissions?limit=20&sort=trending").then(res => res.json())
  });

  // Fetch tools with high ratings (verified reviews)
  const { data: topRatedTools } = useQuery({
    queryKey: ["/api/submissions", "top-rated"],
    queryFn: () => apiRequest("GET", "/api/submissions?limit=8&sort=rating").then(res => res.json())
  });

  // Group tools by popular categories for category showcase
  const groupToolsByCategory = (tools: any[]) => {
    if (!tools) return {};
    const grouped: { [key: string]: any[] } = {};
    
    // Focus on most popular categories
    const popularCategories = [
      'ai-art-generators', 'writing-assistants', 'code-assistants', 
      'large-language-models', 'ai-video-tools', 'computer-vision',
      'healthcare-ai', 'finance-ai', 'education-ai', 'automation-tools'
    ];
    
    tools.forEach(tool => {
      if (popularCategories.includes(tool.category)) {
        if (!grouped[tool.category]) grouped[tool.category] = [];
        if (grouped[tool.category].length < 3) {
          grouped[tool.category].push(tool);
        }
      }
    });
    
    return grouped;
  };

  const handleSearch = (query?: string, category?: string) => {
    if (query !== undefined) setSearchQuery(query);
    if (category !== undefined) setSelectedCategory(category);
    
    if ((query && query.trim()) || category || searchQuery.trim() || selectedCategory) {
      setIsSearching(true);
    }
  };

  const handleSuggestionSelect = (suggestion: any) => {
    // Track click and redirect to the tool's website
    trackClick(suggestion.id);
    window.open(suggestion.website, '_blank', 'noopener,noreferrer');
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? undefined : category);
    setSearchQuery("");
    setIsSearching(true);
  };

  const resetSearch = () => {
    setSearchQuery("");
    setSelectedCategory(undefined);
    setIsSearching(false);
  };

  const trackClick = async (submissionId: number) => {
    try {
      await fetch(`/api/track-click/${submissionId}`, { method: 'POST' });
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  };

  if (isSearching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Button 
                variant="outline" 
                onClick={resetSearch}
                className="mb-4"
              >
                ← Back to Home
              </Button>
              <div className="mb-6">
                <SearchAutoSuggest 
                  onSearch={handleSearch}
                  onSuggestionSelect={handleSuggestionSelect}
                  className="w-full"
                />
              </div>
              {selectedCategory && (
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Category: {getCategoryLabel(selectedCategory)}
                  <button 
                    onClick={() => setSelectedCategory(undefined)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
            <SearchResults query={searchQuery} category={selectedCategory} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find the Best AI Tools
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover, compare, and choose from thousands of AI tools, products, and agents.
            Your comprehensive directory for artificial intelligence solutions.
          </p>
          
          {/* Enhanced Search Bar with Auto-Suggest */}
          <div className="mb-12">
            <SearchAutoSuggest 
              onSearch={handleSearch}
              onSuggestionSelect={handleSuggestionSelect}
              className="w-full"
            />
          </div>

          {/* Real-time Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">114+</div>
                <div className="text-gray-600">AI Tools Listed</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">850+</div>
                <div className="text-gray-600">Verified Reviews</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">37+</div>
                <div className="text-gray-600">Categories</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Homepage Advertisement */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <AdvertisementBanner placement="between-results" />
        </div>
      </div>

      {/* Sponsored Section */}
      {sponsoredSubmissions && sponsoredSubmissions.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center mb-6">
              <Crown className="h-6 w-6 text-purple-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Sponsored AI Tools</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sponsoredSubmissions.slice(0, 6).map((submission: any) => (
                <Card key={submission.id} className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-purple-100 text-purple-800">
                        <Crown className="h-3 w-3 mr-1" />
                        {submission.sponsoredLevel === 'platinum' ? 'Platinum' :
                         submission.sponsoredLevel === 'gold' ? 'Gold' : 'Premium'}
                      </Badge>
                      {submission.rating && (
                        <div className="flex items-center text-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{parseFloat(submission.rating || "0").toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg">{submission.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {submission.description && submission.description.length > 100 
                        ? submission.description.substring(0, 100) + "..." 
                        : submission.description || ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{submission.category}</Badge>
                      <Button 
                        size="sm" 
                        asChild
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <a
                          href={submission.affiliateUrl || submission.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackClick(submission.id)}
                        >
                          Visit Site
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Featured Section */}
      {featuredSubmissions && featuredSubmissions.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center mb-6">
              <Star className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Featured AI Tools</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSubmissions.slice(0, 6).map((submission: any) => (
                <Card key={submission.id} className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-blue-100 text-blue-800">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                      {submission.rating && (
                        <div className="flex items-center text-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{parseFloat(submission.rating || "0").toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg">{submission.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {submission.description && submission.description.length > 100 
                        ? submission.description.substring(0, 100) + "..." 
                        : submission.description || ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{submission.category}</Badge>
                      <Button 
                        size="sm" 
                        asChild
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <a
                          href={submission.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackClick(submission.id)}
                        >
                          Visit Site
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mid-page Advertisement */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <AdvertisementBanner placement="sidebar" />
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card 
                key={category.value}
                className="cursor-pointer hover:shadow-md transition-shadow bg-white/80 backdrop-blur"
                onClick={() => handleCategoryClick(category.value)}
              >
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {category.label}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Have an AI Tool to Share?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Submit your AI tool to our directory and reach thousands of potential users.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              asChild
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <a href="/submit">Submit Your Tool</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}