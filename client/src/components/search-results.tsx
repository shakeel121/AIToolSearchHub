import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Star, ChevronLeft, ChevronRight, DollarSign, Crown } from "lucide-react";

interface SearchResultsProps {
  query: string;
  category?: string;
}

export default function SearchResults({ query, category }: SearchResultsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/search", query, category, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        q: query || "",
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(category && { category }),
      });
      
      const response = await fetch(`/api/search?${params}`);
      if (!response.ok) throw new Error("Search failed");
      return response.json();
    },
    enabled: !!query || !!category,
  });

  if (!query && !category) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Enter a search term or select a category to find AI tools, products, and agents</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <CardContent className="pt-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="w-16 h-16 rounded-lg ml-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading search results. Please try again.</p>
      </div>
    );
  }

  if (!data?.submissions?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No results found for "{query}"</p>
      </div>
    );
  }

  const totalPages = Math.ceil(data.total / limit);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "ai-tools":
        return "bg-blue-100 text-blue-800";
      case "ai-products":
        return "bg-green-100 text-green-800";
      case "ai-agents":
        return "bg-yellow-100 text-yellow-800";
      case "large-language-models":
        return "bg-purple-100 text-purple-800";
      case "computer-vision":
        return "bg-indigo-100 text-indigo-800";
      case "natural-language-processing":
        return "bg-cyan-100 text-cyan-800";
      case "machine-learning-platforms":
        return "bg-orange-100 text-orange-800";
      case "ai-art-generators":
        return "bg-pink-100 text-pink-800";
      case "ai-video-tools":
        return "bg-red-100 text-red-800";
      case "ai-audio-tools":
        return "bg-emerald-100 text-emerald-800";
      case "ai-writing-assistants":
        return "bg-violet-100 text-violet-800";
      case "ai-code-assistants":
        return "bg-slate-100 text-slate-800";
      case "ai-data-analytics":
        return "bg-teal-100 text-teal-800";
      case "ai-automation":
        return "bg-amber-100 text-amber-800";
      case "ai-chatbots":
        return "bg-lime-100 text-lime-800";
      case "ai-research-tools":
        return "bg-sky-100 text-sky-800";
      case "ai-healthcare":
        return "bg-rose-100 text-rose-800";
      case "ai-finance":
        return "bg-green-100 text-green-800";
      case "ai-education":
        return "bg-blue-100 text-blue-800";
      case "ai-marketing":
        return "bg-fuchsia-100 text-fuchsia-800";
      case "ai-productivity":
        return "bg-yellow-100 text-yellow-800";
      case "ai-gaming":
        return "bg-purple-100 text-purple-800";
      case "ai-robotics":
        return "bg-gray-100 text-gray-800";
      case "ai-infrastructure":
        return "bg-stone-100 text-stone-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "ai-tools":
        return "AI Tool";
      case "ai-products":
        return "AI Product";
      case "ai-agents":
        return "AI Agent";
      case "large-language-models":
        return "LLM";
      case "computer-vision":
        return "Computer Vision";
      case "natural-language-processing":
        return "NLP";
      case "machine-learning-platforms":
        return "ML Platform";
      case "ai-art-generators":
        return "AI Art";
      case "ai-video-tools":
        return "AI Video";
      case "ai-audio-tools":
        return "AI Audio";
      case "ai-writing-assistants":
        return "Writing Assistant";
      case "ai-code-assistants":
        return "Code Assistant";
      case "ai-data-analytics":
        return "Data Analytics";
      case "ai-automation":
        return "Automation";
      case "ai-chatbots":
        return "Chatbot";
      case "ai-research-tools":
        return "Research Tool";
      case "ai-healthcare":
        return "Healthcare";
      case "ai-finance":
        return "Finance";
      case "ai-education":
        return "Education";
      case "ai-marketing":
        return "Marketing";
      case "ai-productivity":
        return "Productivity";
      case "ai-gaming":
        return "Gaming";
      case "ai-robotics":
        return "Robotics";
      case "ai-infrastructure":
        return "Infrastructure";
      default:
        return category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Found {data.total} results for "{query}"
        </p>
      </div>

      {data.submissions.map((submission: any) => (
        <Card key={submission.id} className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Badge className={getCategoryColor(submission.category)}>
                    {getCategoryLabel(submission.category)}
                  </Badge>
                  {submission.rating && (
                    <div className="flex items-center ml-3 text-sm text-yellow-600">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1">
                        {submission.rating} ({submission.reviewCount} reviews)
                      </span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  <a 
                    href={submission.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition-colors duration-200 inline-flex items-center"
                  >
                    {submission.name}
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {submission.shortDescription}
                </p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {submission.pricing && (
                    <span>Pricing: {submission.pricing}</span>
                  )}
                  <span>
                    Updated: {new Date(submission.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                
                {submission.tags && submission.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {submission.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              {submission.images && submission.images.length > 0 && (
                <img
                  src={submission.images[0]}
                  alt={submission.name}
                  className="w-16 h-16 rounded-lg object-cover ml-6"
                />
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <nav className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + Math.max(1, currentPage - 2);
              if (page > totalPages) return null;
              
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
}
