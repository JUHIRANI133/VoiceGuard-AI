"use client";

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { RiskLevel } from '@/types';

type RiskMeterProps = {
  riskLevel: RiskLevel;
  size?: number;
};

export default function RiskMeter({ riskLevel, size = 150 }: RiskMeterProps) {
  const riskProps = useMemo(() => {
    switch (riskLevel) {
      case 'high':
        return {
          color: 'hsl(var(--color-risk-danger))',
          glow: 'hsl(var(--color-risk-danger) / 0.7)',
          text: 'High Risk',
          dashOffset: 0,
        };
      case 'medium':
        return {
          color: 'hsl(var(--color-risk-caution))',
          glow: 'hsl(var(--color-risk-caution) / 0.7)',
          text: 'Caution',
          dashOffset: 94,
        };
      default:
        return {
          color: 'hsl(var(--color-risk-safe))',
          glow: 'hsl(var(--color-risk-safe) / 0.7)',
          text: 'Secure',
          dashOffset: 283,
        };
    }
  }, [riskLevel]);

  const animationClass = riskLevel === 'high' ? 'animate-pulsating-ring' : '';

  return (
    <div
      className={cn('relative flex items-center justify-center rounded-full transition-all duration-500', animationClass)}
      style={{
        width: size,
        height: size,
        '--glow-color': riskProps.glow,
        background: `radial-gradient(circle, hsl(var(--background)) 40%, transparent 70%)`
      }}
    >
      <div 
        className="absolute inset-0 rounded-full" 
        style={{boxShadow: `0 0 20px ${riskProps.glow}, inset 0 0 15px ${riskProps.glow}`}}
      />
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className="absolute inset-0"
        >
            <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <circle
                cx="50"
                cy="50"
                r="45"
                stroke={riskProps.color}
                strokeWidth="5"
                fill="none"
                strokeDasharray="283"
                strokeDashoffset={riskProps.dashOffset}
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out, stroke 1s ease-in-out', filter: 'url(#glow)' }}
                strokeLinecap="round"
            />
        </svg>

      <div className="z-10 text-center animate-text-fade-in">
        <div className="font-headline text-2xl font-bold" style={{ color: riskProps.color, textShadow: `0 0 10px ${riskProps.glow}` }}>
          {riskProps.text}
        </div>
      </div>
    </div>
  );
}
