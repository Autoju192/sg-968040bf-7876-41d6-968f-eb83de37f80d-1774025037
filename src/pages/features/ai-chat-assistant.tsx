import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Zap,
  MessageSquare,
  CheckCircle2,
  Lightbulb,
  Clock,
  Brain,
} from "lucide-react";

export default function AIChatAssistantPage() {
  const howItWorksSteps = [
    {
      number: "01",
      title: "Open Chat",
      description: "Click the chat icon on any tender to start a conversation with AI about that specific opportunity.",
      icon: MessageSquare,
    },
    {
      number: "02",
      title: "Ask Questions",
      description: "Ask anything: requirements, scoring criteria, evidence needed, or request draft responses.",
      icon: Lightbulb,
    },
    {
      number: "03",
      title: "AI Responds Using Tender Data",
      description: "AI analyzes the tender specification, your evidence library, and past bids to provide accurate, contextual answers.",
      icon: Brain,
    },
  ];

  const keyOutcomes = [
    {
      icon: Clock,
      title: "Faster Clarity",
      description: "Get instant answers to complex questions instead of re-reading 60-page specifications multiple times.",
    },
    {
      icon: Brain,
      title: "Better Responses",
      description: "AI suggests evidence, identifies gaps, and helps you craft stronger answers aligned with evaluation criteria.",
    },
    {
      icon: CheckCircle2,
      title: "Continuous Support",
      description: "Available 24/7 throughout your bid process, from initial review to final submission.",
    },
  ];

  return (
    <>
      <SEO
        title="AI Chat Assistant - TenderFlow AI"
        description="Ask anything about your tender. Chat with AI to understand requirements, explain scoring criteria, and improve your bid responses in real-time."
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
                <MessageSquare className="w-3 h-3 mr-1" />
                AI Chat Assistant
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Ask Anything About Your Tender
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Chat with your tender like an expert. Get instant answers, understand requirements, and improve responses in real-time.
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
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Answer Questions</h3>
                  <p className="text-muted-foreground">
                    Ask about specific requirements, deadlines, evaluation criteria, or any detail in the tender specification.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Lightbulb className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Explain Scoring Criteria</h3>
                  <p className="text-muted-foreground">
                    AI breaks down complex evaluation criteria and explains exactly what evaluators are looking for in your answers.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Suggest Improvements</h3>
                  <p className="text-muted-foreground">
                    Paste your draft response and AI suggests ways to strengthen it, add missing evidence, or improve clarity.
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
                  <h3 className="text-2xl font-bold mb-4">Without AI Chat:</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Re-read 60-page specifications multiple times</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Spend hours trying to understand complex requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Guess what evaluators want in your answers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Write responses without knowing if they're strong enough</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Stuck when you hit a confusing requirement</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4">With AI Chat:</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Get instant answers without re-reading specifications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>AI explains complex requirements in simple terms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Know exactly what evaluators are looking for</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Get feedback on drafts before final submission</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Never stuck—AI available 24/7 throughout bid process</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Card className="mt-12 p-8 bg-primary/5 border-primary/20">
                <p className="text-xl text-center font-semibold">
                  "The AI chat is like having a bid expert available 24/7. It answers questions instantly and helps us write stronger responses. We've saved countless hours and improved our bid quality."
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
                AI Chat in Action
              </h2>

              <Card className="p-8">
                <div className="aspect-[16/10] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg flex items-center justify-center">
                  <div className="text-center p-8">
                    <MessageSquare className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg mb-2">AI Chat Interface</p>
                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-4">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span>Ask Questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-primary" />
                        <span>Get Answers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Improve Responses</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <h4 className="font-semibold mb-2">Example Questions:</h4>
                    <ul className="space-y-1">
                      <li>• "What are the safeguarding requirements?"</li>
                      <li>• "How is quality assurance scored?"</li>
                      <li>• "Do we have evidence for person-centred care?"</li>
                      <li>• "Can you improve this draft response?"</li>
                      <li>• "What's missing from our bid?"</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">AI Capabilities:</h4>
                    <ul className="space-y-1">
                      <li>• Searches entire tender specification</li>
                      <li>• References your evidence library</li>
                      <li>• Suggests relevant past bid content</li>
                      <li>• Explains complex requirements simply</li>
                      <li>• Provides scoring breakdowns</li>
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
                Stop Struggling with Complex Requirements
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Get instant answers and expert guidance throughout your bid process. Start your free trial today.
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