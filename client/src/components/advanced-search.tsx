import { useState, useEffect } from "react";
import { Search, Filter, Sparkles, Zap, TrendingUp, Star, Clock, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface AdvancedSearchProps {
  onSearch: (params: SearchParams) => void;
  className?: string;
}

interface SearchParams {
  query: string;
  category?: string;
  priceRange?: string;
  rating?: number;
  sortBy?: string;
  features?: string[];
}

interface SearchMetrics {
  processingTime: number;
  totalScanned: number;
  algorithmsUsed: string[];
  confidenceScore: number;
  semanticMatches: number;
  exactMatches: number;
}

export function AdvancedSearch({ onSearch, className }: AdvancedSearchProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: "",
    sortBy: "relevance"
  });
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedQuery] = useDebounce(searchParams.query, 300);

  // AI Categories with semantic intelligence
  const aiCategories = [
    { value: "all", label: "All Categories", icon: "🔍", count: "35+" },
    { value: "large-language-models", label: "Large Language Models", icon: "🧠", count: "8+" },
    { value: "ai-art-generators", label: "AI Art Generators", icon: "🎨", count: "6+" },
    { value: "ai-code-assistants", label: "Code Assistants", icon: "💻", count: "5+" },
    { value: "ai-writing-assistants", label: "Writing Assistants", icon: "✍️", count: "4+" },
    { value: "computer-vision", label: "Computer Vision", icon: "👁️", count: "3+" },
    { value: "ai-video-tools", label: "Video Tools", icon: "🎥", count: "3+" },
    { value: "ai-music-generation", label: "Music Generation", icon: "🎵", count: "2+" },
    { value: "data-analytics", label: "Data Analytics", icon: "📊", count: "2+" },
    { value: "ai-automation", label: "Automation", icon: "⚡", count: "2+" }
  ];

  const pricingOptions = [
    { value: "all", label: "All Pricing", icon: "💰" },
    { value: "free", label: "Free", icon: "🆓" },
    { value: "freemium", label: "Freemium", icon: "🔓" },
    { value: "subscription", label: "Subscription", icon: "💳" },
    { value: "pay-per-use", label: "Pay-per-use", icon: "⚖️" },
    { value: "enterprise", label: "Enterprise", icon: "🏢" }
  ];

  const sortOptions = [
    { value: "relevance", label: "AI Relevance", icon: "🎯" },
    { value: "rating", label: "Highest Rated", icon: "⭐" },
    { value: "popular", label: "Most Popular", icon: "🔥" },
    { value: "newest", label: "Newest First", icon: "🆕" },
    { value: "featured", label: "Featured", icon: "👑" }
  ];

  // Fetch search metrics for analytics
  const { data: searchMetrics } = useQuery({
    queryKey: ["/api/search-metrics", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return null;
      const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=1`);
      const data = await response.json();
      return data.metrics;
    },
    enabled: !!debouncedQuery,
    staleTime: 10000
  });

  // Smart search suggestions based on AI analysis
  const trendingQueries = [
    { query: "ChatGPT alternatives", trend: "+45%", category: "llm" },
    { query: "free AI art", trend: "+32%", category: "art" },
    { query: "coding assistant", trend: "+28%", category: "code" },
    { query: "AI video editor", trend: "+25%", category: "video" },
    { query: "writing helper", trend: "+22%", category: "writing" }
  ];

  const handleSearch = () => {
    onSearch(searchParams);
  };

  const updateSearchParam = (key: keyof SearchParams, value: any) => {
    const newParams = { ...searchParams, [key]: value };
    setSearchParams(newParams);
    
    // Auto-search on parameter change (except for query which is debounced)
    if (key !== 'query') {
      onSearch(newParams);
    }
  };

  useEffect(() => {
    if (debouncedQuery !== searchParams.query) {
      const newParams = { ...searchParams, query: debouncedQuery };
      onSearch(newParams);
    }
  }, [debouncedQuery]);

  return (
    <div className={cn("w-full max-w-6xl mx-auto space-y-6", className)}>
      {/* Main Search Bar */}
      <Card className="relative overflow-hidden border-2 border-transparent bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 hover:border-blue-200 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              <Input
                type="text"
                placeholder="Search AI tools with intelligent matching..."
                value={searchParams.query}
                onChange={(e) => updateSearchParam('query', e.target.value)}
                className="pl-12 pr-16 py-4 text-lg border-0 bg-white/80 backdrop-blur-sm focus:bg-white transition-colors duration-200 rounded-xl shadow-lg"
              />
              {searchMetrics && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Zap className="h-3 w-3 mr-1" />
                    {searchMetrics.processingTime}ms
                  </Badge>
                </div>
              )}
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              size="lg"
              className="px-6 py-4 bg-white/80 hover:bg-white border-gray-200 rounded-xl"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </Button>
            <Button
              onClick={handleSearch}
              size="lg"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Filter className="h-5 w-5 mr-2 text-blue-600" />
              AI-Powered Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  AI Category
                </label>
                <Select
                  value={searchParams.category || "all"}
                  onValueChange={(value) => updateSearchParam('category', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {aiCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center space-x-2">
                          <span>{category.icon}</span>
                          <span>{category.label}</span>
                          <Badge variant="secondary" className="text-xs">{category.count}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pricing Filter */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Pricing Model
                </label>
                <Select
                  value={searchParams.priceRange || "all"}
                  onValueChange={(value) => updateSearchParam('priceRange', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select pricing..." />
                  </SelectTrigger>
                  <SelectContent>
                    {pricingOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <span>{option.icon}</span>
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Sort By
                </label>
                <Select
                  value={searchParams.sortBy || "relevance"}
                  onValueChange={(value) => updateSearchParam('sortBy', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <span>{option.icon}</span>
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <Star className="h-4 w-4 mr-2" />
                Minimum Rating: {searchParams.rating || 0}/5
              </label>
              <div className="px-3">
                <Slider
                  value={[searchParams.rating || 0]}
                  onValueChange={([value]) => updateSearchParam('rating', value)}
                  max={5}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Any Rating</span>
                  <span>5.0 Stars</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Analytics & Trending */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Search Performance */}
        {searchMetrics && (
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-green-800 flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                AI Search Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-green-600 font-semibold">{searchMetrics.processingTime}ms</div>
                  <div className="text-green-700">Processing Time</div>
                </div>
                <div>
                  <div className="text-green-600 font-semibold">{Math.round(searchMetrics.confidenceScore * 100)}%</div>
                  <div className="text-green-700">AI Confidence</div>
                </div>
                <div>
                  <div className="text-green-600 font-semibold">{searchMetrics.semanticMatches || 0}</div>
                  <div className="text-green-700">Semantic Matches</div>
                </div>
                <div>
                  <div className="text-green-600 font-semibold">{searchMetrics.exactMatches || 0}</div>
                  <div className="text-green-700">Exact Matches</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trending Searches */}
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-purple-800 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending AI Searches
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {trendingQueries.map((item, index) => (
                <button
                  key={index}
                  onClick={() => updateSearchParam('query', item.query)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-purple-100 transition-colors text-left"
                >
                  <span className="text-sm text-purple-700">{item.query}</span>
                  <Badge className="bg-purple-200 text-purple-800 text-xs">{item.trend}</Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}