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
          glow: 'hsl(var(--color-risk-danger) / 0.5)',
          text: 'High Risk',
          icon: 'M18.36 6.64a9 9 0 1 1-12.73 0',
        };
      case 'medium':
        return {
          color: 'hsl(var(--color-risk-caution))',
          glow: 'hsl(var(--color-risk-caution) / 0.5)',
          text: 'Caution',
          icon: 'M18.36 6.64a9 9 0 1 1-12.73 0',
        };
      default:
        return {
          color: 'hsl(var(--color-risk-safe))',
          glow: 'hsl(var(--color-risk-safe) / 0.5)',
          text: 'Secure',
          icon: 'M18.36 6.64a9 9 0 1 1-12.73 0',
        };
    }
  }, [riskLevel]);

  const animationClass = riskLevel === 'high' ? 'animate-pulse' : '';

  return (
    <div
      className={cn('relative flex items-center justify-center rounded-full', animationClass)}
      style={{
        width: size,
        height: size,
        '--glow-color': riskProps.glow,
        boxShadow: `0 0 20px ${riskProps.glow}, inset 0 0 15px ${riskProps.glow}`,
        background: `radial-gradient(circle, hsl(var(--background)) 50%, ${riskProps.color} 150%)`
      }}
    >
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className="absolute inset-0"
        >
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
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
                strokeWidth="4"
                fill="none"
                strokeDasharray="283"
                strokeDashoffset={riskLevel === 'high' ? 0 : riskLevel === 'medium' ? 94 : 283}
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out', filter: 'url(#glow)' }}
                strokeLinecap="round"
            />
        </svg>

      <div className="z-10 text-center">
        <div className="font-headline text-2xl font-bold" style={{ color: riskProps.color, textShadow: `0 0 10px ${riskProps.glow}` }}>
          {riskProps.text}
        </div>
      </div>
    </div>
  );
}
