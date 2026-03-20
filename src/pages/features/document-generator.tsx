import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Zap,
  FileText,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
} from "lucide-react";

export default function DocumentGeneratorPage() {
  const howItWorksSteps = [
    {
      number: "01",
      title: "Select Question",
      description: "Choose which tender question you want to answer from the list of requirements.",
      icon: FileText,
    },
    {
      number: "02",
      title: "AI Generates Draft",
      description: "AI searches your evidence library and past bids, then generates a structured draft response aligned to evaluation criteria.",
      icon: Sparkles,
    },
    {
      number: "03",
      title: "Edit & Personalise",
      description: "Review the draft, add local examples, adjust tone, and refine content to match your voice.",
      icon: CheckCircle2,
    },
    {
      number: "04",
      title: "Save & Export",
      description: "Save your response in TenderFlow or export to Word/Google Docs for final submission.",
      icon: Award,
    },
  ];

  const keyOutcomes = [
    {
      icon: Clock,
      title: "Faster Submissions",
      description: "Generate first drafts in seconds instead of hours. Spend time improving content, not starting from scratch.",
    },
    {
      icon: Award,
      title: "Higher Quality Drafts",
      description: "AI uses your best past content, proven evidence, and structured frameworks to create strong starting points.",
    },
    {
      icon: CheckCircle2,
      title: "Consistency Across Bids",
      description: "Maintain consistent messaging, statistics, and quality across all tender responses.",
    },
  ];

  return (
    <>
      <SEO
        title="Document Generator - TenderFlow AI"
        description="Generate winning bid responses faster. AI drafts method statements, answers, and submissions using your evidence library and past bids."
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
                <FileText className="w-3 h-3 mr-1" />
                Document Generator
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Generate Winning Bid Responses Faster
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                AI drafts method statements, responses, and submissions using your past bids and evidence library.
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
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Generates Answers</h3>
                  <p className="text-muted-foreground">
                    AI drafts structured responses for method statements, safeguarding, quality assurance, and all tender questions.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Uses Your Past Bids</h3>
                  <p className="text-muted-foreground">
                    AI references your historical bids to reuse proven content, successful structures, and winning examples.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Aligns to Requirements</h3>
                  <p className="text-muted-foreground">
                    AI structures responses to address all evaluation criteria, score weightings, and mandatory requirements.
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
                      <span>Writing is the slowest part of bidding (4-8 hours per tender)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Starting with a blank page is intimidating and time-consuming</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Inconsistent quality across different bid writers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Rewriting the same content repeatedly for each tender</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Difficulty maintaining consistent messaging and statistics</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4">The Solution:</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Generate first drafts in 15 seconds instead of 4 hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Start with structured, comprehensive content—never a blank page</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Consistent quality using your best past content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>AI reuses proven content—no need to rewrite from scratch</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Automatic consistency in statistics, messaging, and tone</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Card className="mt-12 p-8 bg-primary/5 border-primary/20">
                <p className="text-xl text-center font-semibold">
                  "The document generator saves us 4-6 hours per tender. We start with a solid first draft instead of a blank page, then add our personal touches. Our bid quality has improved and we're bidding on more opportunities."
                </p>
                <p className="text-center text-muted-foreground mt-4">
                  — Sarah Mitchell, Bid Manager, Yorkshire Care Services
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
                Document Generation Interface
              </h2>

              <Card className="p-8">
                <div className="aspect-[16/10] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg flex items-center justify-center">
                  <div className="text-center p-8">
                    <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg mb-2">AI Document Generator</p>
                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span>Select Question</span>
                      </div>
                      <span>→</span>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>AI Generates</span>
                      </div>
                      <span>→</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Review & Submit</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div>
                    <h4 className="font-semibold mb-2">What Gets Generated:</h4>
                    <ul className="space-y-1">
                      <li>• Method statements</li>
                      <li>• Mobilisation plans</li>
                      <li>• Safeguarding responses</li>
                      <li>• Quality assurance answers</li>
                      <li>• Social value commitments</li>
                      <li>• Any tender question</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">AI Uses:</h4>
                    <ul className="space-y-1">
                      <li>• Your evidence library</li>
                      <li>• Past winning bids</li>
                      <li>• Company policies</li>
                      <li>• Case studies</li>
                      <li>• Proven structures</li>
                      <li>• Evaluation criteria</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Output Quality:</h4>
                    <ul className="space-y-1">
                      <li>• Structured format</li>
                      <li>• Word limit compliance</li>
                      <li>• Addresses all criteria</li>
                      <li>• Includes evidence</li>
                      <li>• Professional tone</li>
                      <li>• Ready to personalise</li>
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
                Stop Starting with a Blank Page
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Generate strong first drafts in seconds and focus your time on refinement. Start your free trial today.
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