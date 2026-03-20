import { useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Check,
  X,
  ChevronRight,
  Play,
  Zap,
  Mail,
  FileText,
  Brain,
  BarChart3,
  MessageSquare,
  FileCheck,
  Library,
  History,
  Users,
  Bell,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  Target,
  TrendingUp,
} from "lucide-react";

export default function LandingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");

  const features = [
    {
      icon: Mail,
      title: "Connect Procurement Sources",
      description: "Link Find a Tender, Contracts Finder, Gmail, and council portals in one place.",
      slug: "portal-connections",
    },
    {
      icon: Brain,
      title: "AI Tender Analysis",
      description: "Let AI read specifications, extract requirements, and identify evaluation criteria.",
      slug: "tender-analysis-ai",
    },
    {
      icon: FileCheck,
      title: "Generate Bid Responses",
      description: "Draft method statements and answers using your evidence library and past bids.",
      slug: "document-generator",
    },
    {
      icon: Bell,
      title: "Track Updates & Clarifications",
      description: "Turn tender updates and clarification emails into actionable tasks automatically.",
      slug: "notifications",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Assign tasks, comment on sections, and track progress together in one workspace.",
      slug: "collaboration",
    },
    {
      icon: BarChart3,
      title: "Submitted Bid Tracking",
      description: "Monitor all submitted bids, track deadlines, and record outcomes for analysis.",
      slug: "submitted-bid-tracking",
    },
  ];

  const expandableFeatures = [
    {
      icon: Mail,
      title: "Tender Inbox",
      summary: "All tender alerts in one unified inbox with AI summaries",
      slug: "tender-inbox",
      details: {
        what: "A centralized inbox that consolidates tender alerts from all sources—email, portals, APIs—into one view.",
        why: "Stop checking multiple portals and email folders. See everything in one place with AI-generated summaries.",
        outcomes: ["Save 10+ hours per week on tender discovery", "Never miss an opportunity", "AI highlights urgent items"],
      },
    },
    {
      icon: Zap,
      title: "Portal Connections",
      summary: "Connect Find a Tender, Contracts Finder, and council portals",
      slug: "portal-connections",
      details: {
        what: "Direct integrations with UK procurement portals to automatically fetch tenders matching your criteria.",
        why: "Eliminate manual portal checking. TenderFlow monitors 24/7 and alerts you to relevant opportunities.",
        outcomes: ["Find 40% more opportunities", "Automatic filtering by service type", "Real-time notifications"],
      },
    },
    {
      icon: FileText,
      title: "Gmail & Email Ingestion",
      summary: "Auto-parse tender alerts from Gmail and outlook",
      slug: "gmail-ingestion",
      details: {
        what: "Connect your Gmail to automatically parse tender alert emails, extract details, and create structured records.",
        why: "Tender emails get buried in inboxes. AI reads them for you and turns them into actionable items.",
        outcomes: ["Process emails 10x faster", "Extract deadlines automatically", "Link alerts to tenders"],
      },
    },
    {
      icon: Brain,
      title: "Tender Analysis AI",
      summary: "AI reads specs and extracts requirements in seconds",
      slug: "tender-analysis-ai",
      details: {
        what: "Upload tender documents and let AI extract requirements, evaluation criteria, questions, and deadlines.",
        why: "Reading 60-page specifications takes hours. AI does it in 30 seconds while you focus on strategy.",
        outcomes: ["Save 3+ hours per tender", "Never miss mandatory requirements", "Instant requirement summaries"],
      },
    },
    {
      icon: BarChart3,
      title: "Bid / No-Bid Scoring",
      summary: "AI scores opportunities on service, geography, and evidence fit",
      slug: "bid-no-bid-scoring",
      details: {
        what: "AI automatically scores each tender on service fit, geographic reach, compliance, and evidence availability.",
        why: "Bidding on every opportunity wastes resources. Focus on opportunities you're most likely to win.",
        outcomes: ["Win rate increases 30-40%", "Bid selectively", "Data-driven decisions"],
      },
    },
    {
      icon: MessageSquare,
      title: "AI Chat Assistant",
      summary: "Ask questions about tenders and get instant answers",
      slug: "ai-chat-assistant",
      details: {
        what: "Every tender has a chat interface. Ask about requirements, risks, deadlines, or request draft responses.",
        why: "No more reading specifications repeatedly. Ask AI specific questions and get instant, contextual answers.",
        outcomes: ["Answer questions in seconds", "Draft responses with evidence", "Review work instantly"],
      },
    },
    {
      icon: FileCheck,
      title: "Document Generator",
      summary: "Generate method statements using your evidence library",
      slug: "document-generator",
      details: {
        what: "AI drafts method statements, safeguarding responses, and answers using your company's evidence library.",
        why: "Starting from a blank page takes hours. AI gives you a strong first draft in seconds.",
        outcomes: ["Draft responses 10x faster", "Use proven evidence", "Consistent quality"],
      },
    },
    {
      icon: Library,
      title: "Evidence Library",
      summary: "Store and reuse company policies, case studies, and testimonials",
      slug: "evidence-library",
      details: {
        what: "Centralized repository for policies, case studies, testimonials, and past bids that AI uses to generate responses.",
        why: "Stop searching old bids for good content. Build once, reuse forever.",
        outcomes: ["Reuse best content", "Stronger responses", "Consistent messaging"],
      },
    },
    {
      icon: History,
      title: "Historical Bid Intelligence",
      summary: "Learn from past bids to improve future responses",
      slug: "historical-bids",
      details: {
        what: "Upload past winning and losing bids. AI learns your writing style and what works.",
        why: "Your past bids contain winning formulas. AI replicates what worked and avoids what didn't.",
        outcomes: ["Win rate improves over time", "Learn from losses", "Consistent voice"],
      },
    },
    {
      icon: Users,
      title: "Collaboration & Tasks",
      summary: "Assign bid sections to team members and track progress",
      slug: "collaboration",
      details: {
        what: "Assign questions to team members, comment on sections, track completion, and coordinate bid submissions.",
        why: "Bids require multiple people. Coordinate seamlessly without email chains and spreadsheets.",
        outcomes: ["Clear ownership", "No duplication", "Meet deadlines"],
      },
    },
    {
      icon: CheckCircle2,
      title: "Submitted Bid Tracking",
      summary: "Monitor submitted bids and track win/loss outcomes",
      slug: "submitted-bid-tracking",
      details: {
        what: "Track all submitted bids, record decision dates, capture win/loss feedback, and analyze performance.",
        why: "Learning from outcomes improves future bids. Track what works and what doesn't.",
        outcomes: ["Improve over time", "Understand win rates", "Strategic insights"],
      },
    },
    {
      icon: Bell,
      title: "Notifications & Deadline Alerts",
      summary: "Never miss clarifications, updates, or submission deadlines",
      slug: "notifications",
      details: {
        what: "Real-time alerts for new tenders, clarifications, amendments, approaching deadlines, and team actions.",
        why: "Missing a clarification or deadline can disqualify your bid. Stay informed automatically.",
        outcomes: ["Zero missed deadlines", "Instant clarification alerts", "Team coordination"],
      },
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Connect Your Tender Sources",
      description: "Link Find a Tender, Contracts Finder, Gmail, and council portals in minutes.",
      icon: Zap,
    },
    {
      number: "02",
      title: "Import Tender Files & Emails",
      description: "Upload PDFs, Word files, Excel sheets, or paste tender links. AI extracts everything.",
      icon: FileText,
    },
    {
      number: "03",
      title: "Let AI Analyse, Score & Draft",
      description: "AI reads specifications, scores bid/no-bid fit, and drafts initial responses.",
      icon: Brain,
    },
    {
      number: "04",
      title: "Collaborate, Submit & Track",
      description: "Work with your team, submit bids, and track updates through to award.",
      icon: Users,
    },
  ];

  const testimonials = [
    {
      quote: "TenderFlow AI cut our bid admin time by 70%. We're bidding on more tenders and actually winning them because we have time to focus on quality.",
      name: "Sarah Mitchell",
      role: "Bid Manager",
      company: "Yorkshire Care Services",
    },
    {
      quote: "We stopped missing clarification emails completely. The Gmail integration catches everything and turns it into tasks automatically. It's like having an extra team member.",
      name: "James Patel",
      role: "Operations Director",
      company: "Kent Supported Living",
    },
    {
      quote: "The AI method statement drafts save us hours. We start with a solid first draft instead of a blank page. Our win rate has improved significantly.",
      name: "Emma Thompson",
      role: "Quality Lead",
      company: "Manchester Home Care Ltd",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      description: "For individuals and small teams getting started",
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        "1 user",
        "Tender inbox",
        "Basic AI analysis",
        "10 AI document generations/month",
        "Email alerts",
        "Upload tender files",
        "Email support",
      ],
      notIncluded: [
        "Gmail integration",
        "Portal connections",
        "Collaboration tools",
        "AI chat assistant",
        "Historical bid intelligence",
      ],
      cta: "Start 7-Day Trial",
      highlighted: false,
    },
    {
      name: "Growth",
      description: "For growing teams managing multiple tenders",
      monthlyPrice: 79,
      yearlyPrice: 790,
      features: [
        "5 users",
        "Unlimited tender tracking",
        "AI bid/no-bid scoring",
        "Unlimited AI document generation",
        "Gmail integration",
        "Portal connections",
        "Team collaboration",
        "Evidence library",
        "Notifications & alerts",
        "Historical bid reuse",
        "Priority email support",
      ],
      notIncluded: [
        "AI chat assistant",
        "Advanced workflows",
        "Priority phone support",
      ],
      cta: "Start 7-Day Trial",
      highlighted: true,
      badge: "Most Popular",
    },
    {
      name: "Pro",
      description: "For established teams winning high-value contracts",
      monthlyPrice: 149,
      yearlyPrice: 1490,
      features: [
        "15 users",
        "Everything in Growth",
        "AI chat assistant",
        "Advanced portal connections",
        "Submitted bid tracking",
        "Advanced team workflows",
        "Higher AI usage limits",
        "Upcoming integrations access",
        "Priority phone support",
        "Dedicated success manager",
      ],
      notIncluded: [],
      cta: "Start 7-Day Trial",
      highlighted: false,
    },
  ];

  const comparisonFeatures = [
    { feature: "Users", starter: "1", growth: "5", pro: "15" },
    { feature: "AI Document Generations", starter: "10/month", growth: "Unlimited", pro: "Unlimited" },
    { feature: "Gmail Integration", starter: false, growth: true, pro: true },
    { feature: "Portal Connections", starter: false, growth: true, pro: true },
    { feature: "AI Chat Assistant", starter: false, growth: false, pro: true },
    { feature: "Team Collaboration", starter: false, growth: true, pro: true },
    { feature: "Submitted Bid Tracking", starter: false, growth: false, pro: true },
    { feature: "Priority Support", starter: false, growth: true, pro: true },
  ];

  const faqs = [
    {
      question: "What does TenderFlow AI do?",
      answer: "TenderFlow AI is an AI-powered bid and tender management platform for UK care providers and service businesses. It helps you discover tenders, analyse requirements, generate bid responses, collaborate with your team, and track submissions—all in one workspace.",
    },
    {
      question: "Who is TenderFlow AI for?",
      answer: "TenderFlow AI is designed for UK care providers (domiciliary care, residential care, supported living, mental health services), consultants, and bid teams managing council and NHS tenders. Whether you're a small provider or a large organisation, TenderFlow scales with you.",
    },
    {
      question: "Can I connect Gmail and tender portals?",
      answer: "Yes! TenderFlow integrates with Gmail to automatically parse tender alert emails. We also connect to Find a Tender, Contracts Finder, and select council portals (Proactis, BiP Solutions, etc.) to fetch tenders automatically.",
    },
    {
      question: "Can the AI write my bid answers?",
      answer: "AI generates first drafts of method statements and bid responses using your Evidence Library and past bids. You review, personalise, and refine the content. AI saves you hours by eliminating the blank page problem, but you're always in control.",
    },
    {
      question: "Can I upload PDFs, Word files, Excel files, and URLs?",
      answer: "Absolutely. TenderFlow ingests PDFs, Word documents (.docx), Excel files (.xlsx, .csv), and URLs. AI extracts text, identifies requirements, and structures the content for analysis.",
    },
    {
      question: "Does it support collaboration?",
      answer: "Yes. Assign bid questions to team members, add comments, track progress, and coordinate submissions. Everyone works in the same workspace with full visibility.",
    },
    {
      question: "What happens after I submit a bid?",
      answer: "TenderFlow tracks submitted bids, monitors for clarifications and updates, records decision dates, and captures win/loss outcomes. You can analyse performance over time to improve your win rate.",
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! All plans include a 7-day free trial. No credit card required to start. Try TenderFlow risk-free and see the difference AI makes.",
    },
    {
      question: "Can I switch plans later?",
      answer: "Of course. Upgrade or downgrade your plan anytime from your account settings. Changes take effect at the next billing cycle.",
    },
    {
      question: "Will Registration and Login take me into the app?",
      answer: "Yes. Clicking 'Start Free Trial' or 'Register' takes you to /register. Clicking 'Login' takes you to /login. Both routes lead directly into the TenderFlow AI application.",
    },
  ];

  return (
    <>
      <SEO
        title="TenderFlow AI - Win More Tenders with Less Admin"
        description="AI-powered bid and tender management for UK care providers. Connect portals, analyse requirements, generate responses, and track deadlines in one workspace."
        image="/og-image.png"
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

            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
                Testimonials
              </Link>
              <Link href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
                FAQ
              </Link>
            </div>

            <div className="flex items-center gap-3">
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
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered Bid Management
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                Win More Tenders with Less Admin
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                TenderFlow AI brings tender sources, emails, AI analysis, bid drafting, and deadline tracking into one workspace for care providers and bid teams.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                7-day free trial • No credit card required • Cancel anytime
              </p>
            </div>

            {/* Hero Visual */}
            <div className="relative max-w-6xl mx-auto">
              <div className="relative rounded-xl border bg-card shadow-2xl overflow-hidden">
                <div className="aspect-[16/10] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
                  <div className="text-center p-8">
                    <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Dashboard Preview</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Tender Inbox • AI Scores • Deadline Alerts • Document Generator
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="py-12 border-y bg-muted/30">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-muted-foreground mb-8">
              Trusted by care providers, bid teams, and service businesses across the UK
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Care Providers</p>
              </div>
              <div className="text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Bid Teams</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Consultants</p>
              </div>
              <div className="text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Service Businesses</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Benefits */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Everything You Need to Win More Tenders
              </h2>
              <p className="text-xl text-muted-foreground">
                Stop juggling portals, emails, and spreadsheets. Manage your entire tender pipeline in one AI-powered workspace.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <Link href={`/features/${feature.slug}`} className="text-sm text-primary hover:underline inline-flex items-center">
                      Learn more
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Feature Expansion Cards */}
        <section id="features" className="py-20 md:py-32 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Explore Every Feature
              </h2>
              <p className="text-xl text-muted-foreground">
                Click any card to learn more about how TenderFlow AI can transform your bid process.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {expandableFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Link key={index} href={`/features/${feature.slug}`}>
                    <Card className="p-6 h-full hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{feature.summary}</p>
                      <div className="text-sm text-primary hover:underline inline-flex items-center">
                        Learn more
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                How TenderFlow AI Works
              </h2>
              <p className="text-xl text-muted-foreground">
                From tender discovery to submission tracking—four simple steps.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative">
                    <div className="text-6xl font-bold text-primary/10 mb-4">{step.number}</div>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>

                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/20 to-transparent -translate-x-1/2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 md:py-32 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                What Our Users Say
              </h2>
              <p className="text-xl text-muted-foreground">
                Real feedback from UK care providers and bid teams using TenderFlow AI.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 fill-primary"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Choose the plan that fits your team. All plans include a 7-day free trial.
              </p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className={billingPeriod === "monthly" ? "font-semibold" : "text-muted-foreground"}>
                  Monthly
                </span>
                <button
                  onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
                  className="relative w-14 h-7 bg-muted rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-primary rounded-full transition-transform ${
                      billingPeriod === "yearly" ? "translate-x-7" : ""
                    }`}
                  />
                </button>
                <span className={billingPeriod === "yearly" ? "font-semibold" : "text-muted-foreground"}>
                  Yearly
                </span>
                {billingPeriod === "yearly" && (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100">
                    Save 2 months
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
              {pricingPlans.map((plan, index) => (
                <Card
                  key={index}
                  className={`p-8 relative ${
                    plan.highlighted ? "border-primary shadow-lg scale-105" : ""
                  }`}
                >
                  {plan.highlighted && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                      {plan.badge}
                    </Badge>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">
                        £{billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                      </span>
                      <span className="text-muted-foreground ml-2">
                        /{billingPeriod === "monthly" ? "month" : "year"}
                      </span>
                    </div>
                    {billingPeriod === "yearly" && (
                      <p className="text-sm text-muted-foreground mt-1">
                        £{Math.round(plan.yearlyPrice / 12)}/month billed annually
                      </p>
                    )}
                  </div>

                  <Link href="/signup" className="block mb-6">
                    <Button
                      className="w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>

                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3 opacity-50">
                        <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {/* Feature Comparison */}
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6 text-center">Compare Plans</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4">Feature</th>
                      <th className="text-center py-4 px-4">Starter</th>
                      <th className="text-center py-4 px-4">Growth</th>
                      <th className="text-center py-4 px-4">Pro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-4 px-4 text-sm">{item.feature}</td>
                        <td className="py-4 px-4 text-center text-sm">
                          {typeof item.starter === "boolean" ? (
                            item.starter ? (
                              <Check className="w-5 h-5 text-primary mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            item.starter
                          )}
                        </td>
                        <td className="py-4 px-4 text-center text-sm">
                          {typeof item.growth === "boolean" ? (
                            item.growth ? (
                              <Check className="w-5 h-5 text-primary mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            item.growth
                          )}
                        </td>
                        <td className="py-4 px-4 text-center text-sm">
                          {typeof item.pro === "boolean" ? (
                            item.pro ? (
                              <Check className="w-5 h-5 text-primary mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            item.pro
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 md:py-32 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to know about TenderFlow AI.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                    <AccordionTrigger className="text-left hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Stop Chasing Portals, Emails, and Deadlines Manually
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Start your free trial and manage tenders in one AI-powered workspace.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2" />
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
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <Link href="/landing" className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="font-heading font-bold text-xl">TenderFlow AI</span>
                </Link>
                <p className="text-sm text-muted-foreground">
                  AI-powered bid and tender management for UK care providers and service businesses.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="#features" className="hover:text-foreground transition-colors">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#pricing" className="hover:text-foreground transition-colors">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#testimonials" className="hover:text-foreground transition-colors">
                      Testimonials
                    </Link>
                  </li>
                  <li>
                    <Link href="#faq" className="hover:text-foreground transition-colors">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/about" className="hover:text-foreground transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-foreground transition-colors">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-foreground transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-foreground transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Get Started</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/signup" className="hover:text-foreground transition-colors">
                      Start Free Trial
                    </Link>
                  </li>
                  <li>
                    <Link href="/login" className="hover:text-foreground transition-colors">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/help" className="hover:text-foreground transition-colors">
                      Help & Tutorials
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-foreground transition-colors">
                      Contact Support
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} TenderFlow AI. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms
                </Link>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}