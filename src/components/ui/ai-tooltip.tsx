import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Brain, Info } from "lucide-react";
import { cn } from "@/lib/utils";
interface AITooltipProps {
  children: React.ReactNode;
  content: string;
  confidence?: number;
  source?: string;
  type?: "extraction" | "validation" | "generation" | "scoring" | "flag";
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}
export const AITooltip = ({
  children,
  content,
  confidence,
  source,
  type = "extraction",
  side = "top",
  className
}: AITooltipProps) => {
  const getTypeIcon = () => {
    switch (type) {
      case "flag":
        return <Info className="h-3 w-3 text-red-accent" />;
      default:
        return <Brain className="h-3 w-3 text-primary" />;
    }
  };
  const getTypeColor = () => {
    switch (type) {
      case "flag":
        return "border-red-accent/20 bg-white";
      case "validation":
        return "border-red-accent/20 bg-white";
      default:
        return "border-primary/20 bg-white";
    }
  };
  return <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className={cn("relative cursor-help", className)}>
            {children}
            <div className="absolute -top-1 -right-1 opacity-60 hover:opacity-100 transition-opacity">
              {getTypeIcon()}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side={side} className={cn("max-w-xs p-4 text-sm border-2 shadow-lg animate-fade-in", getTypeColor())} sideOffset={8}>
          <div className="space-y-2">
            
            
            <p className="text-foreground leading-relaxed">{content}</p>
            
            {confidence}
            
            {source && <div className="text-xs text-muted-foreground">
                <span className="font-medium">Source:</span> {source}
              </div>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>;
};