"use client";

import { useContext } from 'react';
import { AppContext } from '@/contexts/app-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RiskMeter from '@/components/ui/risk-meter';
import { Shield, PhoneIncoming, AlertTriangle, CheckCircle } from 'lucide-react';

export default function HomePanel() {
  const { startMockCall } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 text-center animate-text-fade-in">
      <div className="flex flex-col items-center gap-4">
        <RiskMeter riskLevel="low" />
        <h1 className="text-4xl font-bold tracking-tighter md:text-5xl animate-text-fade-in" style={{animationDelay: '100ms'}}>System Secure</h1>
        <p className="max-w-md text-muted-foreground animate-text-fade-in" style={{animationDelay: '200ms'}}>
          VoiceGuard AI is actively monitoring for threats. Your calls are protected in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 w-full max-w-4xl animate-text-fade-in" style={{animationDelay: '300ms'}}>
        <Card className="glassmorphic-card holographic-noise shine-sweep">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Protection</CardTitle>
            <Shield className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-glow-cyan">Cloud Mode</div>
            <p className="text-xs text-muted-foreground">
              Maximum detection accuracy
            </p>
          </CardContent>
        </Card>
        <Card className="glassmorphic-card holographic-noise shine-sweep">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Scams Blocked (7d)</CardTitle>
            <AlertTriangle className="w-5 h-5 text-risk-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{color: 'hsl(var(--color-risk-danger))'}}>12</div>
            <p className="text-xs text-muted-foreground">
              vs. 3 last week
            </p>
          </CardContent>
        </Card>
        <Card className="glassmorphic-card holographic-noise shine-sweep">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Calls Scanned (7d)</CardTitle>
            <CheckCircle className="w-5 h-5 text-risk-safe" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{color: 'hsl(var(--color-risk-safe))'}}>87</div>
            <p className="text-xs text-muted-foreground">
              All other calls were safe
            </p>
          </CardContent>
        </Card>
      </div>

      <Button 
        onClick={startMockCall}
        size="lg"
        className="text-lg font-bold text-background bg-primary hover:bg-primary/90 rounded-full px-8 py-6 shadow-[0_0_20px_hsl(var(--primary))] animate-text-fade-in" style={{animationDelay: '400ms'}}
      >
        <PhoneIncoming className="w-6 h-6 mr-3" />
        Simulate Incoming Call
      </Button>
    </div>
  );
}
