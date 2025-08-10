"use client";

import { useContext, useMemo } from 'react';
import { AppContext } from '@/contexts/app-context';
import { cn } from '@/lib/utils';
import { VolumeX, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export default function FloatingWidget() {
  const { riskLevel, callData } = useContext(AppContext);

  const riskClasses = useMemo(() => {
    switch (riskLevel) {
      case 'high':
        return 'bg-red-500/30 border-red-500 animate-pulse';
      case 'medium':
        return 'bg-yellow-500/30 border-yellow-500';
      default:
        return 'bg-green-500/30 border-green-500';
    }
  }, [riskLevel]);
  
  const riskGlowColor = useMemo(() => {
    switch (riskLevel) {
      case 'high': return 'hsl(var(--color-risk-danger))';
      case 'medium': return 'hsl(var(--color-risk-caution))';
      default: return 'hsl(var(--color-risk-safe))';
    }
  }, [riskLevel]);


  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className={cn("holographic-noise group relative flex items-center justify-center w-20 h-20 rounded-full border-2 transition-all duration-500", riskClasses)}
           style={{ boxShadow: `0 0 15px ${riskGlowColor}, inset 0 0 10px ${riskGlowColor}` }}
      >
        <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, transparent 50%, ${riskGlowColor} 150%)`, opacity: 0.3 }} />
        
        <div className="flex flex-col items-center space-y-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-white/20">
                    <VolumeX className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="glassmorphic">
                <p>Mute Alerts</p>
              </TooltipContent>
            </Tooltip>
        </div>

        { (riskLevel === 'medium' || riskLevel === 'high') && (
            <div className="absolute -top-2 -left-2 animate-ping">
                 <AlertTriangle className="h-6 w-6" style={{color: riskGlowColor, filter: `drop-shadow(0 0 5px ${riskGlowColor})`}} />
            </div>
        )}

      </div>
    </div>
  );
}
