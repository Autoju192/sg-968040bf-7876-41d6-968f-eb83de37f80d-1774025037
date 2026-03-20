import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  AlertCircle,
  Lightbulb,
  PlayCircle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface TutorialDetail {
  id: string;
  featureKey: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  steps: Array<{ title: string; content: string }>;
  troubleshooting: Array<{ problem: string; solution: string }>;
  tips: Array<{ tip: string }>;
  videoUrl?: string;
  completed?: boolean;
  bookmarked?: boolean;
  currentStep: number;
}

export default function TutorialDetailPage() {
  const router = useRouter();
  const { tutorial: tutorialKey } = router.query;
  const { user } = useAuth();
  const [tutorial, setTutorial] = useState<TutorialDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [helpful, setHelpful] = useState<boolean | null>(null);

  useEffect(() => {
    if (tutorialKey) {
      fetchTutorial();
    }
  }, [tutorialKey, user]);

  const fetchTutorial = async () => {
    try {
      setLoading(true);
      
      const key = Array.isArray(tutorialKey) ? tutorialKey[0] : tutorialKey;

      if (!key) return;

      // Fetch tutorial
      const { data: tutorialData, error: tutorialError } = await supabase
        .from("tutorials")
        .select("*")
        .eq("feature_key", key)
        .eq("is_published", true)
        .single();

      if (tutorialError) throw tutorialError;

      // Increment view count
      await supabase
        .from("tutorials")
        .update({ view_count: (tutorialData.view_count || 0) + 1 })
        .eq("id", tutorialData.id);

      // Fetch user progress if logged in
      let progress: any = null;
      if (user) {
        const { data } = await supabase
          .from("user_tutorial_progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("tutorial_id", tutorialData.id)
          .single();

        progress = data;
      }

      setTutorial({
        id: tutorialData.id,
        featureKey: tutorialData.feature_key,
        title: tutorialData.title,
        category: tutorialData.category,
        summary: tutorialData.summary,
        description: tutorialData.description || "",
        steps: (tutorialData.steps as any) || [],
        troubleshooting: (tutorialData.troubleshooting as any) || [],
        tips: (tutorialData.tips as any) || [],
        videoUrl: tutorialData.video_url,
        completed: progress?.completed || false,
        bookmarked: progress?.bookmarked || false,
        currentStep: progress?.current_step || 0,
      });
    } catch (error) {
      console.error("Error fetching tutorial:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async () => {
    if (!user || !tutorial) return;

    try {
      await supabase.from("user_tutorial_progress").upsert({
        user_id: user.id,
        tutorial_id: tutorial.id,
        completed: true,
        completed_at: new Date().toISOString(),
        current_step: tutorial.steps.length,
      });

      setTutorial({ ...tutorial, completed: true });
    } catch (error) {
      console.error("Error marking tutorial as completed:", error);
    }
  };

  const toggleBookmark = async () => {
    if (!user || !tutorial) return;

    try {
      const newBookmarked = !tutorial.bookmarked;

      await supabase.from("user_tutorial_progress").upsert({
        user_id: user.id,
        tutorial_id: tutorial.id,
        bookmarked: newBookmarked,
      });

      setTutorial({ ...tutorial, bookmarked: newBookmarked });
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const markHelpful = async (isHelpful: boolean) => {
    if (!tutorial) return;

    try {
      if (isHelpful) {
        await supabase
          .from("tutorials")
          .update({
            helpful_count: (tutorial as any).helpfulCount + 1,
          })
          .eq("id", tutorial.id);
      }

      setHelpful(isHelpful);
    } catch (error) {
      console.error("Error marking tutorial as helpful:", error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading tutorial...</p>
        </div>
      </Layout>
    );
  }

  if (!tutorial) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Tutorial Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The tutorial you're looking for doesn't exist.
          </p>
          <Link href="/help">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Help Center
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link href="/help">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Help Center
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">{tutorial.category}</Badge>
            <div className="flex gap-2">
              {tutorial.completed && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleBookmark}
                className={tutorial.bookmarked ? "text-yellow-500" : ""}
              >
                {tutorial.bookmarked ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-3">{tutorial.title}</h1>
          <p className="text-lg text-muted-foreground">{tutorial.summary}</p>
        </div>

        {/* Video (if available) */}
        {tutorial.videoUrl && (
          <Card className="p-6 mb-8">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <PlayCircle className="w-16 h-16 text-muted-foreground" />
              <p className="ml-4 text-muted-foreground">Video tutorial coming soon</p>
            </div>
          </Card>
        )}

        {/* Description */}
        {tutorial.description && (
          <Card className="p-6 mb-8">
            <p className="text-muted-foreground">{tutorial.description}</p>
          </Card>
        )}

        {/* Steps */}
        {tutorial.steps.length > 0 && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-primary" />
              Step-by-Step Guide
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {tutorial.steps.map((step, index) => (
                <AccordionItem key={index} value={`step-${index}`}>
                  <AccordionTrigger>
                    <span className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                        {index + 1}
                      </span>
                      {step.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground pl-9">{step.content}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        )}

        {/* Tips */}
        {tutorial.tips.length > 0 && (
          <Card className="p-6 mb-8 border-primary/20 bg-primary/5">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Best Practice Tips
            </h2>
            <ul className="space-y-3">
              {tutorial.tips.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{item.tip}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Troubleshooting */}
        {tutorial.troubleshooting.length > 0 && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Common Issues & Solutions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {tutorial.troubleshooting.map((item, index) => (
                <AccordionItem key={index} value={`issue-${index}`}>
                  <AccordionTrigger>
                    <span className="text-left">{item.problem}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{item.solution}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        )}

        {/* Actions */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Finished this tutorial?</h3>
              <p className="text-sm text-muted-foreground">
                Mark it as complete to track your progress
              </p>
            </div>
            <Button
              onClick={markAsCompleted}
              disabled={tutorial.completed}
              variant={tutorial.completed ? "secondary" : "default"}
            >
              {tutorial.completed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Completed
                </>
              ) : (
                "Mark as Complete"
              )}
            </Button>
          </div>
        </Card>

        {/* Feedback */}
        {helpful === null && (
          <Card className="p-6">
            <p className="text-center mb-4">Was this tutorial helpful?</p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" onClick={() => markHelpful(true)}>
                <ThumbsUp className="w-4 h-4 mr-2" />
                Yes
              </Button>
              <Button variant="outline" onClick={() => markHelpful(false)}>
                <ThumbsDown className="w-4 h-4 mr-2" />
                No
              </Button>
            </div>
          </Card>
        )}

        {helpful !== null && (
          <Card className="p-6 text-center bg-green-50 border-green-200">
            <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-semibold">Thank you for your feedback!</p>
            <p className="text-sm text-muted-foreground">
              We'll use it to improve our tutorials
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
}