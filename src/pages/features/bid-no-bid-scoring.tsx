import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Zap,
  Target,
  CheckCircle2,
  TrendingUp,
  Award,
  AlertTriangle,
} from "lucide-react";

export default function BidNoBidScoringPage() {
  const howItWorksSteps = [
    {
      number: "01",
      title: "Tender Analysed",
      description: "AI reads the tender specification and extracts requirements, evaluation criteria, and delivery expectations.",
      icon: Target,
    },
    {
      number: "02",
      title: "AI Evaluates Fit",
      description: "System scores service fit, geographic fit, compliance fit, and evidence fit against your organisation's capabilities.",
      icon: CheckCircle2,
    },
    {
      number: "03",
      title: "Score & Recommendation Provided",
      description: "Receive a 0-100 score, clear bid/no-bid recommendation, reasoning, identified risks, and suggested next actions.",
      icon: TrendingUp,
    },
  ];

  const keyOutcomes = [
    {
      icon: Target,
      title: "Smarter Bidding",
      description: "Focus only on opportunities you can realistically win. Stop wasting time on poor-fit tenders.",
    },
    {
      icon: Award,
      title: "Higher Win Rate",
      description: "Bidding selectively on 80%+ scored opportunities dramatically improves your success rate.",
    },
    {
      icon: TrendingUp,
      title: "Better ROI",
      description: "Invest your time and resources in winnable contracts. Avoid the hidden costs of failed bids.",
    },
  ];

  return (
    <>
      <SEO
        title="Bid/No-Bid Scoring - TenderFlow AI"
        description="Decide what to bid instantly. AI scores every tender 0-100, analyses fit and risk, and recommends whether to pursue or pass."
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
                <Target className="w-3 h-3 mr-1" />
                Bid/No-Bid Scoring
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Decide What to Bid — Instantly
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                AI helps you focus only on winnable opportunities. Get a clear score, risk analysis, and recommendation for every tender.
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
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Scores Tenders 0–100</h3>
                  <p className="text-muted-foreground">
                    Every tender receives an objective score based on service fit, geographic coverage, compliance readiness, and available evidence.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Analyses Fit & Risk</h3>
                  <p className="text-muted-foreground">
                    AI evaluates whether you can realistically deliver the service, meet requirements, and compete successfully.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Recommends Go/No-Go</h3>
                  <p className="text-muted-foreground">
                    Clear recommendation (BID, REVIEW, or NO BID) with reasoning, risks identified, and suggested next actions.
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
                      <span>Bidding on everything wastes time and resources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Hard to objectively assess opportunity fit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Emotion and pressure drive bid decisions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Low win rates (20-30% typical) demoralise teams</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>No data-driven approach to opportunity selection</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4">The Solution:</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>AI scores every tender objectively in seconds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Clear fit analysis across service, geography, compliance, evidence</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Data-driven recommendations remove guesswork</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Focus on 80%+ opportunities = 50-60% win rates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Historical tracking improves scoring accuracy over time</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Card className="mt-12 p-8 bg-primary/5 border-primary/20">
                <p className="text-xl text-center font-semibold">
                  "AI scoring transformed our bidding strategy. We went from bidding on 15 tenders and winning 3, to bidding on 8 tenders and winning 5. Same effort, better outcomes, happier team."
                </p>
                <p className="text-center text-muted-foreground mt-4">
                  — James Patel, Operations Director, Kent Supported Living
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

              <Card className="mt-12 p-8">
                <h3 className="text-2xl font-semibold mb-6">Scoring Breakdown Example:</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Service Fit:</span>
                      <span className="text-primary font-bold">95%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-primary h-3 rounded-full" style={{ width: "95%" }}></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Perfect match—you provide exactly this service
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Geographic Fit:</span>
                      <span className="text-primary font-bold">85%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-primary h-3 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Leeds is 45 miles from your base—good coverage
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Compliance Fit:</span>
                      <span className="text-primary font-bold">100%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-primary h-3 rounded-full" style={{ width: "100%" }}></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      CQC Good ✓, £10M insurance ✓, 8 years experience ✓
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Evidence Fit:</span>
                      <span className="text-primary font-bold">80%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-primary h-3 rounded-full" style={{ width: "80%" }}></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Good evidence library—5 relevant case studies available
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Overall Score:</span>
                      <span className="text-primary text-2xl">90%</span>
                    </div>
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="font-semibold text-green-700 dark:text-green-300">✓ STRONG BID - High Confidence</p>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        This is an excellent opportunity for your organisation. You meet all requirements and have strong evidence.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
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
                Scoring Dashboard
              </h2>

              <Card className="p-8">
                <div className="aspect-[16/10] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg flex items-center justify-center">
                  <div className="text-center p-8">
                    <Target className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg mb-2">Bid/No-Bid Scoring Interface</p>
                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Strong Bid (80-100%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span>Review (60-79%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        <span>No Bid (0-59%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div>
                    <h4 className="font-semibold mb-2">What Gets Scored:</h4>
                    <ul className="space-y-1">
                      <li>• Service fit (do you provide this?)</li>
                      <li>• Geographic fit (can you deliver here?)</li>
                      <li>• Compliance fit (do you meet requirements?)</li>
                      <li>• Evidence fit (can you prove it?)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Decision Thresholds:</h4>
                    <ul className="space-y-1">
                      <li>• 80-100%: STRONG BID (high confidence)</li>
                      <li>• 60-79%: BID (reasonable fit)</li>
                      <li>• 40-59%: REVIEW (significant challenges)</li>
                      <li>• 0-39%: NO BID (poor fit)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Typical Outcomes:</h4>
                    <ul className="space-y-1">
                      <li>• Bid on 50% fewer tenders</li>
                      <li>• Win 2x more of what you bid on</li>
                      <li>• Save 100+ hours per year</li>
                      <li>• Reduce team frustration</li>
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
                Stop Wasting Time on Unwinnable Bids
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Let AI score every tender and focus your team on opportunities you can actually win. Start your free trial today.
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