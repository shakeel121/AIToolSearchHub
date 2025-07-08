import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Upload, X } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  category: z.enum([
    "ai-tools", 
    "ai-products", 
    "ai-agents",
    "large-language-models",
    "computer-vision",
    "natural-language-processing",
    "machine-learning-platforms",
    "ai-art-generators",
    "ai-video-tools",
    "ai-audio-tools",
    "ai-writing-assistants",
    "ai-code-assistants",
    "ai-data-analytics",
    "ai-automation",
    "ai-chatbots",
    "ai-research-tools",
    "ai-healthcare",
    "ai-finance",
    "ai-education",
    "ai-marketing",
    "ai-productivity",
    "ai-gaming",
    "ai-robotics",
    "ai-infrastructure"
  ], {
    required_error: "Category is required",
  }),
  url: z.string().url("Invalid URL"),
  pricing: z.string().optional(),
  shortDescription: z.string().min(10, "Description must be at least 10 characters").max(200),
  detailedDescription: z.string().min(50, "Detailed description must be at least 50 characters"),
  tags: z.string().optional(),
  contactEmail: z.string().email("Invalid email address"),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function SubmissionForm() {
  const [images, setImages] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      termsAccepted: false,
    },
  });

  const category = watch("category");
  const termsAccepted = watch("termsAccepted");

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { tags, termsAccepted, ...submitData } = data;
      const processedData = {
        ...submitData,
        tags: tags ? tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
        images,
      };
      
      return await apiRequest("POST", "/api/submissions", processedData);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your submission has been received and is pending review.",
      });
      reset();
      setImages([]);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    submitMutation.mutate(data);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result && typeof e.target.result === 'string') {
            setImages(prev => [...prev, e.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Tool Name *</Label>
              <Input
                id="name"
                placeholder="Enter tool name"
                {...register("name")}
                className="mt-1"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value) => setValue("category", value as any)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai-tools">AI Tools</SelectItem>
                  <SelectItem value="ai-products">AI Products</SelectItem>
                  <SelectItem value="ai-agents">AI Agents</SelectItem>
                  <SelectItem value="large-language-models">Large Language Models</SelectItem>
                  <SelectItem value="computer-vision">Computer Vision</SelectItem>
                  <SelectItem value="natural-language-processing">Natural Language Processing</SelectItem>
                  <SelectItem value="machine-learning-platforms">ML Platforms</SelectItem>
                  <SelectItem value="ai-art-generators">AI Art Generators</SelectItem>
                  <SelectItem value="ai-video-tools">AI Video Tools</SelectItem>
                  <SelectItem value="ai-audio-tools">AI Audio Tools</SelectItem>
                  <SelectItem value="ai-writing-assistants">Writing Assistants</SelectItem>
                  <SelectItem value="ai-code-assistants">Code Assistants</SelectItem>
                  <SelectItem value="ai-data-analytics">Data Analytics</SelectItem>
                  <SelectItem value="ai-automation">Automation</SelectItem>
                  <SelectItem value="ai-chatbots">Chatbots</SelectItem>
                  <SelectItem value="ai-research-tools">Research Tools</SelectItem>
                  <SelectItem value="ai-healthcare">Healthcare</SelectItem>
                  <SelectItem value="ai-finance">Finance</SelectItem>
                  <SelectItem value="ai-education">Education</SelectItem>
                  <SelectItem value="ai-marketing">Marketing</SelectItem>
                  <SelectItem value="ai-productivity">Productivity</SelectItem>
                  <SelectItem value="ai-gaming">Gaming</SelectItem>
                  <SelectItem value="ai-robotics">Robotics</SelectItem>
                  <SelectItem value="ai-infrastructure">Infrastructure</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="url">Website URL *</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://your-tool.com"
                {...register("url")}
                className="mt-1"
              />
              {errors.url && (
                <p className="text-red-500 text-sm mt-1">{errors.url.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="pricing">Pricing Model</Label>
              <Select onValueChange={(value) => setValue("pricing", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select pricing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="freemium">Freemium</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="api">API-based</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="shortDescription">Short Description *</Label>
            <Textarea
              id="shortDescription"
              placeholder="Brief description of your AI tool (max 200 characters)"
              {...register("shortDescription")}
              className="mt-1"
              rows={3}
            />
            {errors.shortDescription && (
              <p className="text-red-500 text-sm mt-1">{errors.shortDescription.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="detailedDescription">Detailed Description *</Label>
            <Textarea
              id="detailedDescription"
              placeholder="Detailed description of features, use cases, and benefits"
              {...register("detailedDescription")}
              className="mt-1"
              rows={6}
            />
            {errors.detailedDescription && (
              <p className="text-red-500 text-sm mt-1">{errors.detailedDescription.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="machine learning, nlp, automation"
                {...register("tags")}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="your@email.com"
                {...register("contactEmail")}
                className="mt-1"
              />
              {errors.contactEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.contactEmail.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Upload Screenshots/Images</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors duration-200 mt-1">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drag and drop images here, or click to browse</p>
              <p className="text-sm text-gray-500">PNG, JPG up to 10MB each</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image-upload')?.click()}
                className="mt-4"
              >
                Browse Files
              </Button>
            </div>
            
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setValue("termsAccepted", !!checked)}
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </Label>
          </div>
          {errors.termsAccepted && (
            <p className="text-red-500 text-sm">{errors.termsAccepted.message}</p>
          )}

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => reset()}>
              Reset
            </Button>
            <Button
              type="submit"
              disabled={submitMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {submitMutation.isPending ? "Submitting..." : "Submit for Review"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
