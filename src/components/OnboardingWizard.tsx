import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Rocket, Target, FileText, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => Promise<void>;
  completed: boolean;
}

export function OnboardingWizard() {
  const router = useRouter();
  const { user, organization } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: "welcome",
      title: "Welcome to TenderFlow AI",
      description: "Let's get you set up to start winning more tenders",
      icon: <Rocket className="h-8 w-8 text-purple-600" />,
      action: async () => {},
      completed: false,
    },
    {
      id: "profile",
      title: "Complete Your Profile",
      description: "Add your company information and service details",
      icon: <Target className="h-8 w-8 text-purple-600" />,
      action: async () => {
        router.push("/settings");
      },
      completed: false,
    },
    {
      id: "evidence",
      title: "Build Your Evidence Library",
      description: "Add reusable content for faster bid writing",
      icon: <FileText className="h-8 w-8 text-purple-600" />,
      action: async () => {
        // Create sample evidence items
        const sampleEvidence = [
          {
            organisation_id: organization?.id,
            title: "Company Profile",
            category: "Company Profile",
            content: "Add your company overview, mission, and values here...",
          },
          {
            organisation_id: organization?.id,
            title: "Safeguarding Policy",
            category: "Safeguarding",
            content: "Add your safeguarding policy details here...",
          },
        ];

        await supabase.from("evidence_library").insert(sampleEvidence);
        router.push("/evidence");
      },
      completed: false,
    },
    {
      id: "team",
      title: "Invite Your Team",
      description: "Collaborate with colleagues on bid submissions",
      icon: <Users className="h-8 w-8 text-purple-600" />,
      action: async () => {
        router.push("/team");
      },
      completed: false,
    },
  ]);

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = async () => {
    setLoading(true);
    try {
      await steps[currentStep].action();
      
      // Mark step as completed
      const updatedSteps = [...steps];
      updatedSteps[currentStep].completed = true;
      setSteps(updatedSteps);

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Complete onboarding
        await supabase
          .from("users")
          .update({ onboarding_completed: true })
          .eq("id", user?.id);
        
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Onboarding error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  {step.completed ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  ) : index === currentStep ? (
                    <Circle className="h-6 w-6 text-purple-600 fill-purple-600" />
                  ) : (
                    <Circle className="h-6 w-6 text-slate-300" />
                  )}
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-1 ${index < currentStep ? "bg-green-600" : "bg-slate-200"}`} />
                  )}
                </div>
              ))}
            </div>
            <span className="text-sm text-slate-600">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <Progress value={progress} className="mb-4" />
          <div className="flex items-center gap-4">
            {currentStepData.icon}
            <div>
              <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
              <CardDescription className="text-base mt-1">
                {currentStepData.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep === 0 && (
            <div className="space-y-4">
              <p className="text-slate-700">
                TenderFlow AI helps UK care providers win more tenders with AI-powered analysis, response generation, and bid management.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">🎯 AI Tender Scoring</h4>
                  <p className="text-sm text-slate-600">
                    Automatically evaluate tenders with 6-criteria AI scoring
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">📝 Response Generator</h4>
                  <p className="text-sm text-slate-600">
                    Generate professional UK local authority responses
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">🤖 AI Chat Assistant</h4>
                  <p className="text-sm text-slate-600">
                    Get instant answers about tenders and requirements
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">📚 Evidence Library</h4>
                  <p className="text-sm text-slate-600">
                    Store reusable content across multiple bids
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-slate-700">
                Add your company information to improve AI-generated responses and tender scoring accuracy.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Company name and description</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Service types and geographic coverage</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>CQC registration and compliance details</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Years of experience and key achievements</span>
                </li>
              </ul>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-slate-700">
                Build your evidence library with reusable content to speed up bid writing and improve response quality.
              </p>
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Recommended Evidence Items:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Company profile and mission statement</li>
                  <li>• Safeguarding policies and procedures</li>
                  <li>• Quality assurance framework</li>
                  <li>• Staffing and recruitment processes</li>
                  <li>• Case studies and success stories</li>
                  <li>• Compliance certifications (CQC, ISO, etc.)</li>
                </ul>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-slate-700">
                Invite team members to collaborate on tenders, assign tasks, and share evidence.
              </p>
              <div className="grid gap-3">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <strong className="text-sm">Admin:</strong>
                  <span className="text-sm text-slate-600 ml-2">Full access to all features and settings</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <strong className="text-sm">Bid Manager:</strong>
                  <span className="text-sm text-slate-600 ml-2">Manage tenders and assign tasks</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <strong className="text-sm">Contributor:</strong>
                  <span className="text-sm text-slate-600 ml-2">View tenders and add content</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={handleSkip}>
            Skip for now
          </Button>
          <Button onClick={handleNext} disabled={loading}>
            {loading ? "Loading..." : currentStep === steps.length - 1 ? "Get Started" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}