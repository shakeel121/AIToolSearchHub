import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SearchResults from "@/components/search-results";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleSearch = () => {
    // The SearchResults component will handle the actual search
  };

  const categories = [
    { id: "", label: "All Categories", icon: null },
    { id: "ai-tools", label: "AI Tools", icon: "🛠️" },
    { id: "ai-products", label: "AI Products", icon: "📦" },
    { id: "ai-agents", label: "AI Agents", icon: "🤖" },
    { id: "large-language-models", label: "Large Language Models", icon: "🧠" },
    { id: "computer-vision", label: "Computer Vision", icon: "👁️" },
    { id: "natural-language-processing", label: "NLP", icon: "💬" },
    { id: "machine-learning-platforms", label: "ML Platforms", icon: "⚙️" },
    { id: "ai-art-generators", label: "AI Art", icon: "🎨" },
    { id: "ai-video-tools", label: "AI Video", icon: "🎬" },
    { id: "ai-audio-tools", label: "AI Audio", icon: "🎵" },
    { id: "ai-writing-assistants", label: "Writing Assistants", icon: "✍️" },
    { id: "ai-code-assistants", label: "Code Assistants", icon: "💻" },
    { id: "ai-data-analytics", label: "Data Analytics", icon: "📊" },
    { id: "ai-automation", label: "Automation", icon: "🔄" },
    { id: "ai-chatbots", label: "Chatbots", icon: "💭" },
    { id: "ai-research-tools", label: "Research Tools", icon: "🔬" },
    { id: "ai-healthcare", label: "Healthcare", icon: "🏥" },
    { id: "ai-finance", label: "Finance", icon: "💰" },
    { id: "ai-education", label: "Education", icon: "🎓" },
    { id: "ai-marketing", label: "Marketing", icon: "📢" },
    { id: "ai-productivity", label: "Productivity", icon: "⚡" },
    { id: "ai-gaming", label: "Gaming", icon: "🎮" },
    { id: "ai-robotics", label: "Robotics", icon: "🤖" },
    { id: "ai-infrastructure", label: "Infrastructure", icon: "🏗️" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                Find the Perfect{" "}
                <span className="text-blue-600">AI Tool</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Search through thousands of AI tools, products, and agents. Discover the next breakthrough in artificial intelligence.
              </p>
            </div>

            {/* Search Interface */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search AI tools, products, or agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-shadow duration-200"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button
                  onClick={handleSearch}
                  className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Category Filters */}
            <div className="mb-12">
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {categories.slice(0, 8).map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full transition-colors duration-200 font-medium text-sm ${
                      selectedCategory === category.id
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-white border border-gray-300 text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {category.icon && <span className="mr-1">{category.icon}</span>}
                    {category.label}
                  </Button>
                ))}
              </div>
              
              {/* Additional Categories - Collapsed by default */}
              <div className="flex flex-wrap justify-center gap-2">
                {categories.slice(8).map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1 rounded-full transition-colors duration-200 font-medium text-xs ${
                      selectedCategory === category.id
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-white border border-gray-300 text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {category.icon && <span className="mr-1">{category.icon}</span>}
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Search Results */}
            <SearchResults query={searchQuery} category={selectedCategory} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
