import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { CheckCircle, XCircle, Star, DollarSign, Eye, Trash2, Edit, TrendingUp, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Submission } from "@shared/schema";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

interface EditSubmissionFormData {
  name: string;
  description: string;
  website: string;
  category: string;
  pricingModel: string;
  featured: boolean;
  sponsoredLevel: string | null;
  sponsorshipStartDate: string;
  sponsorshipEndDate: string;
  commissionRate: string;
  affiliateUrl: string;
}

export default function AdminPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(null);
  const [formData, setFormData] = useState<EditSubmissionFormData>({
    name: "",
    description: "",
    website: "",
    category: "",
    pricingModel: "",
    featured: false,
    sponsoredLevel: null,
    sponsorshipStartDate: "",
    sponsorshipEndDate: "",
    commissionRate: "0.00",
    affiliateUrl: ""
  });

  // Queries
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: () => apiRequest("GET", "/api/admin/stats").then(res => res.json())
  });

  const { data: submissionsData } = useQuery({
    queryKey: ["/api/admin/submissions", currentPage],
    queryFn: () => apiRequest("GET", `/api/admin/submissions?page=${currentPage}`).then(res => res.json())
  });

  const { data: pendingSubmissions } = useQuery({
    queryKey: ["/api/admin/pending"],
    queryFn: () => apiRequest("GET", "/api/admin/pending").then(res => res.json())
  });

  const { data: analytics } = useQuery({
    queryKey: ["/api/admin/analytics"],
    queryFn: () => apiRequest("GET", "/api/admin/analytics").then(res => res.json())
  });

  // Mutations
  const approveMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/admin/approve/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Submission approved successfully" });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/admin/reject/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Submission rejected successfully" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) =>
      apiRequest("PUT", `/api/admin/submissions/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/submissions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setEditingSubmission(null);
      toast({ title: "Submission updated successfully" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/submissions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/submissions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Submission deleted successfully" });
    }
  });

  const featureMutation = useMutation({
    mutationFn: ({ id, featured }: { id: number; featured: boolean }) =>
      apiRequest("POST", `/api/admin/submissions/${id}/feature`, { featured }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/submissions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Featured status updated successfully" });
    }
  });

  const sponsorMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiRequest("POST", `/api/admin/submissions/${id}/sponsor`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/submissions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Sponsorship updated successfully" });
    }
  });

  const openEditDialog = (submission: Submission) => {
    setEditingSubmission(submission);
    setFormData({
      name: submission.name,
      description: submission.description,
      website: submission.website,
      category: submission.category,
      pricingModel: submission.pricingModel,
      featured: submission.featured,
      sponsoredLevel: submission.sponsoredLevel,
      sponsorshipStartDate: submission.sponsorshipStartDate ? new Date(submission.sponsorshipStartDate).toISOString().split('T')[0] : "",
      sponsorshipEndDate: submission.sponsorshipEndDate ? new Date(submission.sponsorshipEndDate).toISOString().split('T')[0] : "",
      commissionRate: submission.commissionRate || "0.00",
      affiliateUrl: submission.affiliateUrl || ""
    });
  };

  const handleUpdate = () => {
    if (!editingSubmission) return;
    updateMutation.mutate({ id: editingSubmission.id, updates: formData });
  };

  const categoryData = analytics?.topPerformers
    ? analytics.topPerformers.reduce((acc: any[], item: any) => {
        const existing = acc.find(a => a.category === item.category);
        if (existing) {
          existing.count += 1;
          existing.clicks += item.clicks;
        } else {
          acc.push({ category: item.category, count: 1, clicks: item.clicks });
        }
        return acc;
      }, [])
    : [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Badge variant="secondary">
          {stats ? `${stats.total} Total Submissions` : "Loading..."}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="submissions">All Submissions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="monetization">Monetization</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.approved || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <XCircle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pending || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Featured</CardTitle>
                <Star className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.featured || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sponsored</CardTitle>
                <DollarSign className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.sponsored || 0}</div>
              </CardContent>
            </Card>
          </div>

          {categoryData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, count }) => `${category}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Submissions ({pendingSubmissions?.length || 0})</CardTitle>
              <CardDescription>Review and approve new submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingSubmissions?.map((submission: Submission) => (
                  <div key={submission.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{submission.name}</h3>
                        <p className="text-sm text-gray-600">{submission.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Category: {submission.category}</span>
                          <span>•</span>
                          <span>Pricing: {submission.pricingModel}</span>
                          <span>•</span>
                          <a 
                            href={submission.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Visit Website
                          </a>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => approveMutation.mutate(submission.id)}
                          disabled={approveMutation.isPending}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectMutation.mutate(submission.id)}
                          disabled={rejectMutation.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {!pendingSubmissions?.length && (
                  <p className="text-center text-gray-500 py-8">No pending submissions</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Submissions</CardTitle>
              <CardDescription>Manage all submissions in the database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissionsData?.submissions?.map((submission: Submission) => (
                  <div key={submission.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{submission.name}</h3>
                          <Badge variant={submission.status === "approved" ? "default" : submission.status === "pending" ? "secondary" : "destructive"}>
                            {submission.status}
                          </Badge>
                          {submission.featured && (
                            <Badge variant="outline" className="text-blue-600">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          {submission.sponsoredLevel && (
                            <Badge variant="outline" className="text-purple-600">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {submission.sponsoredLevel}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{submission.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{submission.category}</span>
                          <span>•</span>
                          <span>{submission.pricingModel}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {submission.monthlyClicks || 0} clicks
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => featureMutation.mutate({ id: submission.id, featured: !submission.featured })}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(submission)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Submission</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{submission.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(submission.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {submissionsData?.hasMore && (
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={submissionsData?.page === Math.ceil(submissionsData?.total / submissionsData?.limit)}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics?.totalClicks?.toLocaleString() || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${analytics?.totalRevenue?.toFixed(2) || "0.00"}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Avg. Revenue per Click</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${analytics?.totalClicks > 0 ? (analytics.totalRevenue / analytics.totalClicks).toFixed(4) : "0.00"}
                </div>
              </CardContent>
            </Card>
          </div>

          {analytics?.topPerformers?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analytics.topPerformers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="clicks" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="monetization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monetization Controls</CardTitle>
              <CardDescription>Manage featured listings and sponsorships</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Use the "All Submissions" tab to feature listings or set sponsorship levels for individual submissions.
                Revenue tracking and analytics are available in the Analytics tab.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Featured Listings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Featured listings appear prominently in search results and have a special badge.
                      Currently {stats?.featured || 0} listings are featured.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sponsored Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Sponsored listings can have premium, gold, or platinum levels with different commission rates.
                      Currently {stats?.sponsored || 0} listings are sponsored.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Submission Dialog */}
      <Dialog open={!!editingSubmission} onOpenChange={() => setEditingSubmission(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Submission</DialogTitle>
            <DialogDescription>
              Update submission details and monetization settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Large Language Models">Large Language Models</SelectItem>
                    <SelectItem value="Computer Vision">Computer Vision</SelectItem>
                    <SelectItem value="Natural Language Processing">Natural Language Processing</SelectItem>
                    <SelectItem value="Machine Learning Platforms">Machine Learning Platforms</SelectItem>
                    <SelectItem value="AI Art Generators">AI Art Generators</SelectItem>
                    <SelectItem value="Video Generation">Video Generation</SelectItem>
                    <SelectItem value="Audio Tools">Audio Tools</SelectItem>
                    <SelectItem value="Writing Assistants">Writing Assistants</SelectItem>
                    <SelectItem value="Code Assistants">Code Assistants</SelectItem>
                    <SelectItem value="Data Analytics">Data Analytics</SelectItem>
                    <SelectItem value="Healthcare AI">Healthcare AI</SelectItem>
                    <SelectItem value="Finance AI">Finance AI</SelectItem>
                    <SelectItem value="Education AI">Education AI</SelectItem>
                    <SelectItem value="Marketing AI">Marketing AI</SelectItem>
                    <SelectItem value="Automation Tools">Automation Tools</SelectItem>
                    <SelectItem value="Chatbots">Chatbots</SelectItem>
                    <SelectItem value="Research Tools">Research Tools</SelectItem>
                    <SelectItem value="Productivity">Productivity</SelectItem>
                    <SelectItem value="Gaming AI">Gaming AI</SelectItem>
                    <SelectItem value="Robotics">Robotics</SelectItem>
                    <SelectItem value="AI Infrastructure">AI Infrastructure</SelectItem>
                    <SelectItem value="Content Creation">Content Creation</SelectItem>
                    <SelectItem value="Search & Discovery">Search & Discovery</SelectItem>
                    <SelectItem value="Personalization">Personalization</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pricingModel">Pricing Model</Label>
                <Select value={formData.pricingModel} onValueChange={(value) => setFormData({ ...formData, pricingModel: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pricing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Free">Free</SelectItem>
                    <SelectItem value="Freemium">Freemium</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Subscription">Subscription</SelectItem>
                    <SelectItem value="Pay-per-use">Pay-per-use</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-semibold">Monetization Settings</h4>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured">Featured Listing</Label>
              </div>

              <div>
                <Label htmlFor="sponsoredLevel">Sponsorship Level</Label>
                <Select 
                  value={formData.sponsoredLevel || ""} 
                  onValueChange={(value) => setFormData({ ...formData, sponsoredLevel: value || null })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="No sponsorship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.sponsoredLevel && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sponsorshipStartDate">Start Date</Label>
                      <Input
                        id="sponsorshipStartDate"
                        type="date"
                        value={formData.sponsorshipStartDate}
                        onChange={(e) => setFormData({ ...formData, sponsorshipStartDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sponsorshipEndDate">End Date</Label>
                      <Input
                        id="sponsorshipEndDate"
                        type="date"
                        value={formData.sponsorshipEndDate}
                        onChange={(e) => setFormData({ ...formData, sponsorshipEndDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                    <Input
                      id="commissionRate"
                      type="number"
                      step="0.01"
                      value={formData.commissionRate}
                      onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="affiliateUrl">Affiliate URL</Label>
                    <Input
                      id="affiliateUrl"
                      value={formData.affiliateUrl}
                      onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSubmission(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              Update Submission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}