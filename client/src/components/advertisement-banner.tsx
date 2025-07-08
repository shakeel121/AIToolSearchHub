import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Eye } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface AdvertisementBannerProps {
  placement: string;
  className?: string;
}

export default function AdvertisementBanner({ placement, className = "" }: AdvertisementBannerProps) {
  const { data: advertisements } = useQuery({
    queryKey: [`/api/advertisements/${placement}`],
    enabled: !!placement,
  });

  if (!advertisements || advertisements.length === 0) {
    return null;
  }

  // Show the first active advertisement for this placement
  const ad = advertisements[0];

  const handleClick = async () => {
    try {
      // Track the click
      await apiRequest(`/api/advertisements/${ad.id}/click`, { method: "POST" });
      // Open the advertisement URL
      window.open(ad.targetUrl, "_blank");
    } catch (error) {
      console.error("Failed to track advertisement click:", error);
      // Still open the URL even if tracking fails
      window.open(ad.targetUrl, "_blank");
    }
  };

  const handleImpression = async () => {
    try {
      await apiRequest(`/api/advertisements/${ad.id}/impression`, { method: "POST" });
    } catch (error) {
      console.error("Failed to track advertisement impression:", error);
    }
  };

  // Track impression when component mounts
  React.useEffect(() => {
    handleImpression();
  }, [ad.id]);

  return (
    <Card 
      className={`border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 cursor-pointer hover:shadow-md transition-shadow ${className}`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                Sponsored
              </Badge>
              <div className="flex items-center text-xs text-gray-500">
                <Eye className="h-3 w-3 mr-1" />
                {ad.impressions || 0} views
              </div>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">{ad.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{ad.description}</p>
            <div className="flex items-center text-sm text-blue-600">
              <ExternalLink className="h-3 w-3 mr-1" />
              Learn More
            </div>
          </div>
          {ad.imageUrl && (
            <div className="ml-4">
              <img 
                src={ad.imageUrl} 
                alt={ad.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}