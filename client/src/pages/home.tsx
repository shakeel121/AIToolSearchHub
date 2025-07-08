import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Star, Crown, TrendingUp, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SearchResults from "@/components/search-results";
import { apiRequest } from "@/lib/queryClient";

const categories = [
  "Large Language Models", "Computer Vision", "Natural Language Processing",
  "Machine Learning Platforms", "AI Art Generators", "Video Generation",
  "Audio Tools", "Writing Assistants", "Code Assistants", "Data Analytics",
  "Healthcare AI", "Finance AI", "Education AI", "Marketing AI",
  "Automation Tools", "Chatbots", "Research Tools", "Productivity",
  "Gaming AI", "Robotics", "AI Infrastructure", "Content Creation",
  "Search & Discovery", "Personalization"
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [isSearching, setIsSearching] = useState(false);

  // Fetch featured and sponsored content for homepage
  const { data: featuredSubmissions } = useQuery({
    queryKey: ["/api/featured"],
    queryFn: () => apiRequest("GET", "/api/featured").then(res => res.json())
  });

  const { data: sponsoredSubmissions } = useQuery({
    queryKey: ["/api/sponsored"],
    queryFn: () => apiRequest("GET", "/api/sponsored").then(res => res.json())
  });

  const handleSearch = () => {
    if (searchQuery.trim() || selectedCategory) {
      setIsSearching(true);
    }
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
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="relative flex-1 max-w-xl">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search AI tools, products, and agents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 py-3 text-lg"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch} size="lg">
                  Search
                </Button>
              </div>
              {selectedCategory && (
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Category: {selectedCategory}
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
          
          {/* Search Bar */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search AI tools, products, and agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-4 text-lg border-2 border-gray-200 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} size="lg" className="px-8 py-4">
              Search
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">1000+</div>
                <div className="text-gray-600">AI Tools Listed</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-gray-600">Verified Reviews</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">24</div>
                <div className="text-gray-600">Categories</div>
              </CardContent>
            </Card>
          </div>
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
                          <span>{submission.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg">{submission.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {submission.description.length > 100 
                        ? submission.description.substring(0, 100) + "..." 
                        : submission.description}
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
                          <span>{submission.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg">{submission.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {submission.description.length > 100 
                        ? submission.description.substring(0, 100) + "..." 
                        : submission.description}
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

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card 
                key={category}
                className="cursor-pointer hover:shadow-md transition-shadow bg-white/80 backdrop-blur"
                onClick={() => handleCategoryClick(category)}
              >
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {category}
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