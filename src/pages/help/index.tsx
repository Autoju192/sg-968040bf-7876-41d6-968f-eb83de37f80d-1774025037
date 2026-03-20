import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  BookOpen,
  PlayCircle,
  HelpCircle,
  CheckCircle2,
  Bookmark,
  MessageSquare,
  ChevronRight,
  Lightbulb,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Tutorial {
  id: string;
  featureKey: string;
  title: string;
  category: string;
  summary: string;
  viewCount: number;
  completed?: boolean;
  bookmarked?: boolean;
}

export default function HelpCenterPage() {
  const { user } = useAuth();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [filteredTutorials, setFilteredTutorials] = useState<Tutorial[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: "all", label: "All Tutorials", icon: BookOpen },
    { value: "Getting Started", label: "Getting Started", icon: Zap },
    { value: "Core Features", label: "Core Features", icon: PlayCircle },
    { value: "Integrations", label: "Integrations", icon: HelpCircle },
    { value: "Advanced", label: "Advanced", icon: Lightbulb },
  ];

  useEffect(() => {
    fetchTutorials();
  }, [user]);

  useEffect(() => {
    filterTutorials();
  }, [searchQuery, selectedCategory, tutorials]);

  const fetchTutorials = async () => {
    try {
      setLoading(true);

      // Fetch all published tutorials
      const { data: tutorialsData, error: tutorialsError } = await supabase
        .from("tutorials")
        .select("*")
        .eq("is_published", true)
        .order("category", { ascending: true })
        .order("title", { ascending: true });

      if (tutorialsError) throw tutorialsError;

      // Fetch user progress if logged in
      let progressData: any[] = [];
      if (user) {
        const { data, error } = await supabase
          .from("user_tutorial_progress")
          .select("*")
          .eq("user_id", user.id);

        if (!error) progressData = data || [];
      }

      // Merge tutorials with progress
      const tutorialsWithProgress = (tutorialsData || []).map((tutorial) => {
        const progress = progressData.find((p) => p.tutorial_id === tutorial.id);
        return {
          id: tutorial.id,
          featureKey: tutorial.feature_key,
          title: tutorial.title,
          category: tutorial.category,
          summary: tutorial.summary,
          viewCount: tutorial.view_count || 0,
          completed: progress?.completed || false,
          bookmarked: progress?.bookmarked || false,
        };
      });

      setTutorials(tutorialsWithProgress);
      setFilteredTutorials(tutorialsWithProgress);
    } catch (error) {
      console.error("Error fetching tutorials:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTutorials = () => {
    let filtered = tutorials;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.summary.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query)
      );
    }

    setFilteredTutorials(filtered);
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.value === category);
    return cat ? cat.icon : BookOpen;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Help & Tutorials</h1>
          <p className="text-muted-foreground">
            Learn how to use TenderFlow AI to win more tenders
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/help/onboarding">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Quick Start Guide</h3>
                  <p className="text-sm text-muted-foreground">
                    New to TenderFlow? Start here for a guided tour
                  </p>
                </div>
              </div>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/help/ai-assistant">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Ask AI Help Assistant</h3>
                  <p className="text-sm text-muted-foreground">
                    Get instant answers to your questions
                  </p>
                </div>
              </div>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/help/troubleshooting">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <HelpCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Troubleshooting</h3>
                  <p className="text-sm text-muted-foreground">
                    Fix common issues quickly
                  </p>
                </div>
              </div>
            </Link>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
          <TabsList className="grid w-full grid-cols-5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <TabsTrigger key={cat.value} value={cat.value} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Tutorials Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading tutorials...</p>
          </div>
        ) : filteredTutorials.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tutorials found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "Try a different search term"
                : "No tutorials available in this category"}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.map((tutorial) => {
              const Icon = getCategoryIcon(tutorial.category);
              return (
                <Link key={tutorial.id} href={`/help/${tutorial.featureKey}`}>
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex gap-2">
                        {tutorial.completed && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Done
                          </Badge>
                        )}
                        {tutorial.bookmarked && (
                          <Bookmark className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                    </div>

                    <Badge variant="outline" className="mb-3">
                      {tutorial.category}
                    </Badge>

                    <h3 className="font-semibold mb-2">{tutorial.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {tutorial.summary}
                    </p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{tutorial.viewCount} views</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}