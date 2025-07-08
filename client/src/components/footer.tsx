import { Link } from "wouter";

export default function Footer() {
  const footerSections = [
    {
      title: "Discover",
      links: [
        { name: "AI Tools", href: "/?category=ai-tools" },
        { name: "AI Products", href: "/?category=ai-products" },
        { name: "AI Agents", href: "/?category=ai-agents" },
        { name: "Categories", href: "/" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Submit Tool", href: "/submit" },
        { name: "API Documentation", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Help Center", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Contact", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold">
                AI<span className="text-blue-400">Search</span>
              </span>
            </div>
            <p className="text-gray-400">
              The world's largest search engine for AI tools, products, and agents.
            </p>
          </div>
          
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2 text-gray-400">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 AISearch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
