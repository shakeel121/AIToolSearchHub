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

const getPlacementStyles = (placement: string) => {
  switch (placement) {
    case "header":
      return "border-dashed border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]";
    case "sidebar":
      return "border-dashed border-green-200 bg-gradient-to-r from-green-50 to-blue-50 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105";
    case "between-results":
      return "border-dashed border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.01]";
    case "footer":
      return "border-dashed border-gray-300 bg-gradient-to-r from-gray-100 to-slate-100 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] text-gray-800";
    default:
      return "border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]";
  }
};

export default function AdvertisementBanner({ placement, className = "" }: AdvertisementBannerProps) {
  const { data: advertisements } = useQuery({
    queryKey: [`/api/advertisements/${placement}`],
    enabled: !!placement,
  });

  // Always call useCallback and useEffect hooks, regardless of data state
  const handleClick = React.useCallback(async () => {
    const ad = advertisements?.[0];
    if (!ad) return;
    
    try {
      await apiRequest(`/api/advertisements/${ad.id}/click`, { method: "POST" });
      window.open(ad.targetUrl, "_blank");
    } catch (error) {
      console.error("Failed to track advertisement click:", error);
      window.open(ad.targetUrl, "_blank");
    }
  }, [advertisements]);

  const handleImpression = React.useCallback(async () => {
    const ad = advertisements?.[0];
    if (!ad) return;
    
    try {
      await apiRequest(`/api/advertisements/${ad.id}/impression`, { method: "POST" });
    } catch (error) {
      console.error("Failed to track advertisement impression:", error);
    }
  }, [advertisements]);

  React.useEffect(() => {
    const ad = advertisements?.[0];
    if (ad) {
      handleImpression();
    }
  }, [advertisements, handleImpression]);

  // Early return after all hooks are called
  if (!advertisements || advertisements.length === 0) {
    return null;
  }

  const ad = advertisements[0];

  return (
    <Card 
      className={`${getPlacementStyles(placement)} ${className}`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700 border-purple-300">
                ✨ Sponsored
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