import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Database, CheckCircle, Clock, Check, X, Eye, ExternalLink } from "lucide-react";

export default function AdminPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  const { data: pendingSubmissions, isLoading: pendingLoading } = useQuery({
    queryKey: ["/api/admin/pending"],
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("POST", `/api/admin/approve/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Submission approved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve submission.",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("POST", `/api/admin/reject/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Submission rejected successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject submission.",
        variant: "destructive",
      });
    },
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "ai-tools":
        return "bg-blue-100 text-blue-800";
      case "ai-products":
        return "bg-green-100 text-green-800";
      case "ai-agents":
        return "bg-yellow-100 text-yellow-800";
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
      default:
        return category;
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Submissions</p>
                    <p className="text-3xl font-bold">{stats?.total || 0}</p>
                  </div>
                  <Database className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Approved Tools</p>
                    <p className="text-3xl font-bold">{stats?.approved || 0}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">Pending Review</p>
                    <p className="text-3xl font-bold">{stats?.pending || 0}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-200" />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Pending Submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Pending Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : !pendingSubmissions?.length ? (
            <p className="text-center text-gray-500 py-8">No pending submissions</p>
          ) : (
            <div className="space-y-4">
              {pendingSubmissions.map((submission: any) => (
                <div key={submission.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge className={getCategoryColor(submission.category)}>
                          {getCategoryLabel(submission.category)}
                        </Badge>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
                          Pending
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-1">{submission.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{submission.shortDescription}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <a
                          href={submission.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center hover:text-blue-600"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          {submission.url}
                        </a>
                        <span>
                          Submitted: {new Date(submission.createdAt).toLocaleDateString()}
                        </span>
                        <span>Contact: {submission.contactEmail}</span>
                      </div>

                      {submission.tags && submission.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {submission.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(submission.url, '_blank')}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => approveMutation.mutate(submission.id)}
                        disabled={approveMutation.isPending}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => rejectMutation.mutate(submission.id)}
                        disabled={rejectMutation.isPending}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
