import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Zap,
  FileCheck,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Award,
} from "lucide-react";

export default function SubmittedBidTrackingPage() {
  const howItWorksSteps = [
    {
      number: "01",
      title: "Mark Bid as Submitted",
      description: "When you submit a bid, mark it as 'Submitted' in TenderFlow. Record submission date, method, and any reference numbers.",
      icon: FileCheck,
    },
    {
      number: "02",
      title: "Track Post-Submission Updates",
      description: "Monitor evaluation progress, respond to clarifications, track interview invitations, and stay informed throughout the process.",
      icon: TrendingUp,
    },
    {
      number: "03",
      title: "Record Outcome and Feedback",
      description: "When the decision is made, record whether you won or lost, capture evaluator feedback, and note lessons learned for future bids.",
      icon: Award,
    },
  ];

  const keyOutcomes = [
    {
      icon: BarChart3,
      title: "Better Reporting",
      description: "See win rates, average scores, success by tender type, and ROI. Data-driven insights improve your bidding strategy.",
    },
    {
      icon: TrendingUp,
      title: "Improved Strategy",
      description: "Learn from outcomes. Identify which tender types you win most often and where to focus your effort for best results.",
    },
    {
      icon: CheckCircle2,
      title: "Never Lose Visibility",
      description: "Stay on top of every submitted bid. Know when decisions are due, when to follow up, and never miss award notifications.",
    },
  ];

  return (
    <>
      <SEO
        title="Submitted Bid Tracking - TenderFlow AI"
        description="Track every submitted bid from submission through to award. Monitor outcomes, capture feedback, and improve your bidding strategy with data-driven insights."
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
                <FileCheck className="w-3 h-3 mr-1" />
                Submitted Bid Tracking
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Track Every Submitted Bid
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Never lose visibility after submission. Monitor outcomes, capture feedback, and improve your strategy with data-driven insights.
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
                    <FileCheck className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Track Submissions</h3>
                  <p className="text-muted-foreground">
                    Record submission date, method, reference number, and status. Know exactly what you've submitted and when decisions are due.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Monitor Outcomes</h3>
                  <p className="text-muted-foreground">
                    Track evaluation progress, capture whether you won or lost, record scores received, and store evaluator feedback for learning.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Store Feedback</h3>
                  <p className="text-muted-foreground">
                    Save debriefs, scores, strengths, weaknesses, and lessons learned. Use this intelligence to improve future bids continuously.
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
                  <h3 className="text-2xl font-bold mb-4">Without Tracking:</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Don't know when decisions are due</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Miss award notifications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Can't calculate win rate or ROI</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Lose evaluator feedback</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Repeat same mistakes in future bids</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4">With Tracking:</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Know exactly when to expect results</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Never miss contract award announcements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Clear visibility into win rates and trends</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Capture and review all feedback</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Learn continuously, improve with data</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Card className="mt-12 p-8 bg-primary/5 border-primary/20">
                <p className="text-xl text-center font-semibold">
                  "Post-submission tracking has been a game-changer. We now know our win rate, which tender types we excel at, and where to improve. Data-driven bidding beats guesswork every time."
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
                Submitted Bids Dashboard
              </h2>

              <Card className="p-8">
                <div className="aspect-[16/10] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg flex items-center justify-center">
                  <div className="text-center p-8">
                    <FileCheck className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg mb-2">Submitted Bid Tracking Dashboard</p>
                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-4">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-primary" />
                        <span>Submissions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-green-500" />
                        <span>Outcomes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        <span>Analytics</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div>
                    <h4 className="font-semibold mb-2">Track Details:</h4>
                    <ul className="space-y-1">
                      <li>• Submission date and method</li>
                      <li>• Reference numbers</li>
                      <li>• Decision due date</li>
                      <li>• Evaluation status</li>
                      <li>• Interview invitations</li>
                      <li>• Clarification requests</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Record Outcomes:</h4>
                    <ul className="space-y-1">
                      <li>• Won or lost status</li>
                      <li>• Scores received</li>
                      <li>• Evaluator feedback</li>
                      <li>• Strengths identified</li>
                      <li>• Areas for improvement</li>
                      <li>• Lessons learned</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Analytics:</h4>
                    <ul className="space-y-1">
                      <li>• Overall win rate</li>
                      <li>• Win rate by tender type</li>
                      <li>• Average scores</li>
                      <li>• ROI analysis</li>
                      <li>• Success trends</li>
                      <li>• Performance insights</li>
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
                Never Lose Track of Your Bids
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Monitor submissions, capture outcomes, and improve continuously. Start your free trial today.
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