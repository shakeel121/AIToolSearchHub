import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Crown } from "lucide-react";

interface SubmissionCardProps {
  submission: any;
  trackClick: (id: number) => void;
  variant?: 'sponsored' | 'featured' | 'regular';
}

export function SubmissionCard({ submission, trackClick, variant = 'regular' }: SubmissionCardProps) {
  const safeDescription = submission.description || '';
  const displayDescription = safeDescription.length > 100 
    ? safeDescription.substring(0, 100) + "..." 
    : safeDescription;

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          {variant === 'sponsored' && (
            <Badge className="bg-purple-100 text-purple-800">
              <Crown className="h-3 w-3 mr-1" />
              {submission.sponsoredLevel === 'platinum' ? 'Platinum' :
               submission.sponsoredLevel === 'gold' ? 'Gold' : 'Premium'}
            </Badge>
          )}
          {variant === 'featured' && (
            <Badge className="bg-blue-100 text-blue-800">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {variant === 'regular' && (
            <Badge variant="outline">{submission.category}</Badge>
          )}
          {submission.rating && (
            <div className="flex items-center text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span>{parseFloat(submission.rating || "0").toFixed(1)}</span>
            </div>
          )}
        </div>
        <CardTitle className="text-lg">{submission.name}</CardTitle>
        <CardDescription className="text-sm">
          {displayDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {variant !== 'regular' && (
            <Badge variant="outline">{submission.category}</Badge>
          )}
          <Button 
            size="sm" 
            asChild
            className={`${
              variant === 'sponsored' ? 'bg-purple-600 hover:bg-purple-700' :
              variant === 'featured' ? 'bg-blue-600 hover:bg-blue-700' :
              'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            <a
              href={submission.affiliateUrl || submission.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick(submission.id)}
            >
              Visit
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}