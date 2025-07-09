import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { Search, TrendingUp, Star, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

interface SearchAutoSuggestProps {
  onSearch: (query: string, category?: string) => void;
  onSuggestionSelect: (suggestion: any) => void;
  className?: string;
}

interface Suggestion {
  id: number;
  name: string;
  category: string;
  description: string;
  rating?: string;
  website: string;
}

export function SearchAutoSuggest({ onSearch, onSuggestionSelect, className }: SearchAutoSuggestProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Use ultra-fast debouncing for instant search
  const [debouncedQuery] = useDebounce(query, 80); // Ultra-fast 80ms debounce

  // Fetch suggestions
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["/api/search", debouncedQuery],
    queryFn: () => 
      apiRequest("GET", `/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=8`)
        .then(res => res.json()),
    enabled: debouncedQuery.length >= 2,
    staleTime: 30000, // Cache for 30 seconds for better performance
  });

  // Popular categories for quick access
  const popularCategories = [
    { label: "AI Art Generators", value: "ai-art-generators", icon: "🎨" },
    { label: "Writing Assistants", value: "writing-assistants", icon: "✍️" },
    { label: "Code Assistants", value: "code-assistants", icon: "💻" },
    { label: "Large Language Models", value: "large-language-models", icon: "🧠" },
    { label: "Video Tools", value: "ai-video-tools", icon: "🎥" },
    { label: "Data Analytics", value: "data-analytics", icon: "📊" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length >= 2);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    const suggestionCount = suggestions?.submissions?.length || 0;
    const totalItems = suggestionCount + popularCategories.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev <= 0 ? totalItems - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (selectedIndex < suggestionCount) {
            // Selected a suggestion
            const suggestion = suggestions.submissions[selectedIndex];
            onSuggestionSelect(suggestion);
          } else {
            // Selected a category
            const categoryIndex = selectedIndex - suggestionCount;
            const category = popularCategories[categoryIndex];
            onSearch("", category.value);
          }
        } else {
          // Search with current query
          onSearch(query);
        }
        setIsOpen(false);
        inputRef.current?.blur();
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSubmit = () => {
    onSearch(query);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    onSuggestionSelect(suggestion);
    setIsOpen(false);
    setQuery("");
  };

  const handleCategoryClick = (category: { value: string; label: string }) => {
    onSearch("", category.value);
    setIsOpen(false);
    setQuery("");
  };

  const getCategoryLabel = (value: string) => {
    const category = popularCategories.find(cat => cat.value === value);
    return category?.label || value;
  };

  return (
    <div className={cn("relative max-w-3xl mx-auto", className)}>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 z-10" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search 114+ AI tools instantly..."
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 1 && setIsOpen(true)}
          onBlur={(e) => {
            // Delay closing to allow clicks on suggestions
            setTimeout(() => {
              if (!suggestionsRef.current?.contains(document.activeElement)) {
                setIsOpen(false);
              }
            }, 150);
          }}
            className="pl-14 pr-32 py-5 text-lg border-0 focus:ring-0 focus:outline-none rounded-2xl bg-transparent placeholder:text-gray-400"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {isLoading && (
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            )}
            <Button 
              onClick={handleSubmit}
              size="sm"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <Card 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-3 z-50 shadow-2xl border border-gray-200 max-h-[32rem] overflow-hidden rounded-2xl bg-white/95 backdrop-blur-lg"
        >
          <CardContent className="p-0 suggestions-container overflow-y-auto max-h-[32rem]">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Searching...</span>
              </div>
            )}

            {!isLoading && suggestions?.submissions && suggestions.submissions.length > 0 && (
              <div className="border-b border-gray-100">
                <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 text-sm font-semibold text-gray-800 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
                  AI Tools ({suggestions.submissions.length})
                  <Badge className="ml-auto bg-blue-100 text-blue-700 text-xs">Live Results</Badge>
                </div>
                {suggestions.submissions.map((suggestion: Suggestion, index: number) => (
                  <div
                    key={suggestion.id}
                    className={cn(
                      "px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200 group",
                      selectedIndex === index && "bg-gradient-to-r from-blue-50 to-purple-50"
                    )}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start space-x-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                              {suggestion.name}
                            </div>
                            <div className="text-sm text-gray-600 line-clamp-2 mt-1 leading-relaxed">
                              {suggestion.description}
                            </div>
                            <div className="flex items-center space-x-3 mt-2">
                              <Badge variant="outline" className="text-xs bg-white border-gray-300">
                                {getCategoryLabel(suggestion.category)}
                              </Badge>
                              {suggestion.rating && (
                                <div className="flex items-center text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                  <Star className="h-3 w-3 fill-current mr-1" />
                                  {parseFloat(suggestion.rating).toFixed(1)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Popular Categories */}
            {query.length >= 1 && (
              <div>
                <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 text-sm font-semibold text-gray-800 flex items-center">
                  <Search className="h-4 w-4 mr-2 text-purple-600" />
                  Popular Categories
                  <Badge className="ml-auto bg-purple-100 text-purple-700 text-xs">Quick Access</Badge>
                </div>
                {popularCategories.map((category, index) => {
                  const adjustedIndex = (suggestions?.submissions?.length || 0) + index;
                  return (
                    <div
                      key={category.value}
                      className={cn(
                        "px-6 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200 group",
                        selectedIndex === adjustedIndex && "bg-gradient-to-r from-purple-50 to-pink-50"
                      )}
                      onClick={() => handleCategoryClick(category)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-xl bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                            {category.icon}
                          </span>
                          <span className="font-medium text-gray-900 group-hover:text-purple-700 transition-colors">
                            {category.label}
                          </span>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!isLoading && debouncedQuery.length >= 2 && (!suggestions?.submissions || suggestions.submissions.length === 0) && (
              <div className="px-6 py-12 text-center text-gray-500">
                <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <div className="text-lg font-medium text-gray-700">No results found for "{debouncedQuery}"</div>
                <div className="text-sm mt-2 text-gray-500">Try different keywords or browse categories below</div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Backdrop to close suggestions */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}