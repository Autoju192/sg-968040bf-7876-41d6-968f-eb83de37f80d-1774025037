import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, CheckCircle2, Zap, Mail, FileText, Bot } from "lucide-react";
import { useRouter } from "next/router";

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  action?: {
    label: string;
    path: string;
  };
}

const steps: Step[] = [
  {
    id: "welcome",
    title: "Welcome to TenderFlow AI",
    description: "Your complete AI Bid Operating System. Let's get you set up to win more tenders in just a few steps.",
    icon: Zap,
  },
  {
    id: "connections",
    title: "Connect Tender Sources",
    description: "Automate your tender discovery by connecting Find a Tender, Contracts Finder, and your Gmail account to parse tender alerts automatically.",
    icon: Mail,
    action: {
      label: "Go to Integrations",
      path: "/integrations",
    },
  },
  {
    id: "inbox",
    title: "Manage Your Tender Inbox",
    description: "All your tender alerts and updates flow into one unified inbox. Our AI automatically summarizes them and highlights required actions.",
    icon: FileText,
    action: {
      label: "View Inbox",
      path: "/inbox",
    },
  },
  {
    id: "ai_assistant",
    title: "Meet Your AI Chat Assistant",
    description: "Every tender has a built-in AI assistant. Ask questions, analyze requirements, and generate bid documents using your past evidence.",
    icon: Bot,
    action: {
      label: "View Tenders",
      path: "/tenders",
    },
  }
];

export function OnboardingWizard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Only show if user is logged in and hasn't seen it
    if (user) {
      const hasSeenOnboarding = localStorage.getItem(`onboarding_complete_${user.id}`);
      if (!hasSeenOnboarding) {
        // Small delay to not overwhelm on login
        const timer = setTimeout(() => setIsOpen(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      finishOnboarding();
    } else {
      setCurrentStepIndex(i => i + 1);
    }
  };

  const handleBack = () => {
    setCurrentStepIndex(i => i - 1);
  };

  const handleAction = () => {
    if (currentStep.action) {
      router.push(currentStep.action.path);
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    if (user) {
      localStorage.setItem(`onboarding_complete_${user.id}`, "true");
    }
    setIsOpen(false);
  };

  const Icon = currentStep.icon;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) finishOnboarding();
    }}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="bg-primary/5 p-8 flex flex-col items-center justify-center text-center relative border-b">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
            <Icon className="w-8 h-8" />
          </div>
          <DialogTitle className="text-2xl font-bold mb-2">{currentStep.title}</DialogTitle>
          <p className="text-muted-foreground">{currentStep.description}</p>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Step {currentStepIndex + 1} of {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {currentStep.action && (
            <div className="mb-6 flex justify-center">
              <Button onClick={handleAction} variant="outline" className="w-full sm:w-auto">
                {currentStep.action.label}
              </Button>
            </div>
          )}

          <DialogFooter className="flex items-center sm:justify-between w-full">
            <Button 
              variant="ghost" 
              onClick={handleBack} 
              disabled={currentStepIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            
            <div className="flex gap-2">
              <Button variant="ghost" onClick={finishOnboarding}>
                Skip
              </Button>
              <Button onClick={handleNext}>
                {isLastStep ? (
                  <>Get Started <CheckCircle2 className="w-4 h-4 ml-2" /></>
                ) : (
                  <>Next <ChevronRight className="w-4 h-4 ml-2" /></>
                )}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}