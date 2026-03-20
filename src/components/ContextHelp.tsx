import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HelpCircle, BookOpen, Lightbulb } from "lucide-react";
import Link from "next/link";

interface ContextHelpProps {
  title: string;
  description: string;
  steps?: string[];
  tips?: string[];
  tutorialLink?: string;
}

/**
 * Context Help Component
 * Provides contextual help on any page with "How this works" button
 */
export function ContextHelp({
  title,
  description,
  steps = [],
  tips = [],
  tutorialLink,
}: ContextHelpProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle className="w-4 h-4" />
          How this works
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 max-h-[600px] overflow-y-auto" align="end">
        <div className="space-y-4">
          {/* Header */}
          <div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {/* Steps */}
          {steps.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                How to use
              </h4>
              <ol className="space-y-2">
                {steps.map((step, index) => (
                  <li key={index} className="text-sm flex gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Tips */}
          {tips.length > 0 && (
            <Card className="p-3 bg-primary/5 border-primary/20">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                Quick Tips
              </h4>
              <ul className="space-y-1">
                {tips.map((tip, index) => (
                  <li key={index} className="text-xs text-muted-foreground flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Tutorial Link */}
          {tutorialLink && (
            <div className="pt-2 border-t">
              <Link href={tutorialLink}>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                  <BookOpen className="w-4 h-4" />
                  View full tutorial
                </Button>
              </Link>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}