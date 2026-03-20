import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Zap,
  Users,
  CheckCircle2,
  MessageSquare,
  ListTodo,
  UserPlus,
} from "lucide-react";

export default function CollaborationPage() {
  const howItWorksSteps = [
    {
      number: "01",
      title: "Create Tender and Assign Tasks",
      description: "Break down bid work into specific tasks and assign them to team members with clear deadlines and priorities.",
      icon: ListTodo,
    },
    {
      number: "02",
      title: "Collaborate in Real-Time",
      description: "Team members comment on sections, ask questions, share updates, and @mention colleagues for input.",
      icon: MessageSquare,
    },
    {
      number: "03",
      title: "Track Progress Together",
      description: "See who's working on what, what's complete, and what's blocked. Everyone stays aligned and informed.",
      icon: CheckCircle2,
    },
  ];

  const keyOutcomes = [
    {
      icon: Users,
      title: "Better Coordination",
      description: "Everyone knows their role, deadline, and priority. No confusion about who's doing what or when it's due.",
    },
    {
      icon: CheckCircle2,
      title: "Faster Delivery",
      description: "Tasks get done in parallel instead of waiting for handoffs. Team works together, not in silos.",
    },
    {
      icon: MessageSquare,
      title: "Clear Communication",
      description: "All discussions happen in context, attached to the specific tender and section. No lost emails or forgotten conversations.",
    },
  ];

  return (
    <>
      <SEO
        title="Team Collaboration - TenderFlow AI"
        description="Assign tasks, track progress, and work together on bids. Built for care provider teams managing multiple tenders simultaneously."
      />

      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/landing" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-xl">TenderFlow AI</span>
            </Link>

            <div className="flex items-center gap-3">
              <Link href="/landing">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/landing#pricing">
                <Button variant="ghost" size="sm">
                  Pricing
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                <Users className="w-3 h-3 mr-1" />
                Team Collaboration
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Collaborate on Bids with Your Team
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Assign tasks, track progress, and work together. Built for care provider teams managing multiple tenders simultaneously.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg">
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/landing#pricing">
                  <Button size="lg" variant="outline">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* What It Does */}
        <section className="py-20 md:py-32 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
                What It Does
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <ListTodo className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Task Assignment</h3>
                  <p className="text-muted-foreground">
                    Break bids into tasks, assign to team members, set deadlines, and track completion. Everyone knows what they're responsible for.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Comments & Mentions</h3>
                  <p className="text-muted-foreground">
                    Comment on tender sections, ask questions, share updates. Use @mentions to bring specific colleagues into the conversation.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Status Tracking</h3>
                  <p className="text-muted-foreground">
                    Track bid status from "Not Started" to "Submitted" to "Awarded". See progress at a glance and identify bottlenecks.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Why It Matters */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
                Why It Matters
              </h2>

              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold mb-4">The Problem:</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Email chains become overwhelming and confusing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>No clear view of who's doing what</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Handoffs slow everything down</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Tasks fall through cracks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Last-minute scrambling before deadline</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4">The Solution:</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>All collaboration happens in one place</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Crystal-clear task ownership and deadlines</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Work happens in parallel, not sequentially</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Nothing gets forgotten or missed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Smooth, organized bid delivery</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Card className="mt-12 p-8 bg-primary/5 border-primary/20">
                <p className="text-xl text-center font-semibold">
                  "Bids are team efforts. TenderFlow keeps everyone aligned without endless email chains. Tasks are clear, progress is visible, and we submit bids with confidence."
                </p>
                <p className="text-center text-muted-foreground mt-4">
                  — Emma Thompson, Quality Lead, Manchester Home Care Ltd
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 md:py-32 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
                How It Works
              </h2>

              <div className="space-y-8">
                {howItWorksSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <Card key={index} className="p-6">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                          <div className="text-6xl font-bold text-primary/10">{step.number}</div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-2xl font-semibold">{step.title}</h3>
                          </div>
                          <p className="text-muted-foreground text-lg">{step.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Key Outcomes */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
                Key Outcomes
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                {keyOutcomes.map((outcome, index) => {
                  const Icon = outcome.icon;
                  return (
                    <Card key={index} className="p-6 text-center">
                      <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{outcome.title}</h3>
                      <p className="text-muted-foreground">{outcome.description}</p>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* UI Preview */}
        <section className="py-20 md:py-32 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
                Team Collaboration Interface
              </h2>

              <Card className="p-8">
                <div className="aspect-[16/10] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg flex items-center justify-center">
                  <div className="text-center p-8">
                    <Users className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg mb-2">Team Collaboration Dashboard</p>
                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-4">
                      <div className="flex items-center gap-2">
                        <ListTodo className="w-4 h-4 text-primary" />
                        <span>Task Board</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span>Comments</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Progress Tracking</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div>
                    <h4 className="font-semibold mb-2">Task Management:</h4>
                    <ul className="space-y-1">
                      <li>• Create tasks for each bid section</li>
                      <li>• Assign to team members</li>
                      <li>• Set deadlines and priorities</li>
                      <li>• Track completion status</li>
                      <li>• View team workload</li>
                      <li>• Filter by status or person</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Communication:</h4>
                    <ul className="space-y-1">
                      <li>• Comment on any section</li>
                      <li>• @mention team members</li>
                      <li>• Attach files and evidence</li>
                      <li>• Thread conversations</li>
                      <li>• Get notified of replies</li>
                      <li>• Keep context together</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Progress Tracking:</h4>
                    <ul className="space-y-1">
                      <li>• See completion percentage</li>
                      <li>• Identify bottlenecks early</li>
                      <li>• View team activity feed</li>
                      <li>• Track time to deadline</li>
                      <li>• Monitor bid status</li>
                      <li>• Report to leadership</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Stop Working in Silos
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Bring your team together in one workspace. Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg">
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    Login to Your Account
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                7-day free trial • No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <Link href="/landing" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-heading font-bold text-xl">TenderFlow AI</span>
              </Link>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <Link href="/landing#features" className="hover:text-foreground transition-colors">
                  Features
                </Link>
                <Link href="/landing#pricing" className="hover:text-foreground transition-colors">
                  Pricing
                </Link>
                <Link href="/landing#faq" className="hover:text-foreground transition-colors">
                  FAQ
                </Link>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}