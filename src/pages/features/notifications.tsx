import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Zap,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  Mail,
} from "lucide-react";

export default function NotificationsPage() {
  const howItWorksSteps = [
    {
      number: "01",
      title: "System Detects Important Event",
      description: "TenderFlow monitors all your tenders for deadline changes, clarifications, amendments, and new opportunities matching your criteria.",
      icon: AlertCircle,
    },
    {
      number: "02",
      title: "Intelligent Notification Triggered",
      description: "AI evaluates urgency and relevance, then sends notifications via email, in-app alerts, or mobile push based on your preferences.",
      icon: Bell,
    },
    {
      number: "03",
      title: "You Take Action Immediately",
      description: "Click notification to view tender details, read the update, assign tasks to team members, or respond to clarifications before deadlines.",
      icon: CheckCircle2,
    },
  ];

  const keyOutcomes = [
    {
      icon: CheckCircle2,
      title: "Zero Missed Deadlines",
      description: "Get alerted 48 hours, 24 hours, and 2 hours before every tender deadline. Never submit late or miss an opportunity.",
    },
    {
      icon: Clock,
      title: "Faster Response Times",
      description: "Respond to clarifications and amendments within hours, not days. Show commissioners you're organised and responsive.",
    },
    {
      icon: AlertCircle,
      title: "Stay Proactive",
      description: "Know about changes immediately instead of discovering them too late. Adapt your bid strategy in real-time.",
    },
  ];

  return (
    <>
      <SEO
        title="Notifications & Deadline Alerts - TenderFlow AI"
        description="Never miss a deadline, clarification, or tender update. Smart notifications keep your team informed and responsive."
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
                <Bell className="w-3 h-3 mr-1" />
                Notifications & Alerts
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Never Miss a Deadline or Update
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Get notified when something matters. Stay on top of every tender deadline, clarification, and amendment.
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
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Deadline Alerts</h3>
                  <p className="text-muted-foreground">
                    Automatic reminders at 48 hours, 24 hours, and 2 hours before tender deadlines. Never submit late again.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <AlertCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Clarification Alerts</h3>
                  <p className="text-muted-foreground">
                    Instant notification when councils post Q&A responses or clarifications. Respond quickly and update your bid.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">New Tender Alerts</h3>
                  <p className="text-muted-foreground">
                    Get notified immediately when new tenders matching your criteria are published. Be first to respond.
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
                  <h3 className="text-2xl font-bold mb-4">Without Notifications:</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Miss clarification emails buried in inbox</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Discover deadline changes too late</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Submit bids late or incomplete</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Competitors respond faster than you</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Constantly checking portals manually</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4">With Notifications:</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Instant alerts for every important update</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Multiple reminders before deadlines</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Always submit on time, fully prepared</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Respond to clarifications within hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>System monitors everything 24/7 for you</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Card className="mt-12 p-8 bg-primary/5 border-primary/20">
                <p className="text-xl text-center font-semibold">
                  "We haven't missed a clarification deadline since implementing TenderFlow's notifications. The multi-stage deadline alerts give us confidence that nothing slips through the cracks."
                </p>
                <p className="text-center text-muted-foreground mt-4">
                  — David Chen, Operations Manager, Bristol Care Solutions
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
                Notification Centre
              </h2>

              <Card className="p-8">
                <div className="aspect-[16/10] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg flex items-center justify-center">
                  <div className="text-center p-8">
                    <Bell className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg mb-2">Smart Notification Dashboard</p>
                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>Deadline Alerts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        <span>Clarifications</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <span>New Tenders</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div>
                    <h4 className="font-semibold mb-2">Notification Types:</h4>
                    <ul className="space-y-1">
                      <li>• Deadline reminders (48h, 24h, 2h)</li>
                      <li>• Clarification posted</li>
                      <li>• Amendment published</li>
                      <li>• Deadline extended</li>
                      <li>• New tender matched</li>
                      <li>• Award decision made</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Delivery Channels:</h4>
                    <ul className="space-y-1">
                      <li>• In-app notification centre</li>
                      <li>• Email alerts (configurable)</li>
                      <li>• Mobile push notifications</li>
                      <li>• SMS for urgent items (Pro)</li>
                      <li>• Slack integration (Pro)</li>
                      <li>• Microsoft Teams (Pro)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Smart Features:</h4>
                    <ul className="space-y-1">
                      <li>• Priority-based routing</li>
                      <li>• Quiet hours respected</li>
                      <li>• Digest mode available</li>
                      <li>• Per-tender preferences</li>
                      <li>• Team member mentions</li>
                      <li>• Snooze and reminders</li>
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
                Stop Missing Critical Updates
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Let TenderFlow monitor every tender 24/7 and alert you when action is needed. Start your free trial today.
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