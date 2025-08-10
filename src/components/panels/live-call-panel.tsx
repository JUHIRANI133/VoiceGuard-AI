"use client";

import { useContext } from 'react';
import { AppContext } from '@/contexts/app-context';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { PhoneOff, UserCheck, Mic, Siren, AlertTriangle, Bot } from 'lucide-react';

export default function LiveCallPanel() {
  const { callData, riskLevel, endCall } = useContext(AppContext);

  const riskColor = riskLevel === 'high' ? 'hsl(var(--color-risk-danger))' : riskLevel === 'medium' ? 'hsl(var(--color-risk-caution))' : 'hsl(var(--color-risk-safe))';

  return (
    <div className="h-full flex flex-col gap-4 animate-screen-swipe">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-glow">Live Call Analysis</h1>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full animate-pulse`} style={{ backgroundColor: riskColor }} />
            <p className="text-muted-foreground">
              Caller: <span className="font-bold text-foreground">{callData.callerName}</span> ({callData.callerNumber})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="destructive" className="bg-marvel-red/80 hover:bg-marvel-red border border-marvel-red text-white shadow-[0_0_15px_var(--color-marvel-red)] font-bold">
            <Siren className="w-4 h-4 mr-2" />
            Safe Interrupt
          </Button>
          <Button onClick={endCall} variant="outline" className="font-bold">
            <PhoneOff className="w-4 h-4 mr-2" />
            End Call
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow min-h-0">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card className="glassmorphic holographic-noise">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="text-primary" /> Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-bold w-24 capitalize">{riskLevel} Risk</span>
                <Progress value={callData.riskScore} className="h-4" style={{'--tw-bg-primary': riskColor, '--tw-bg-secondary': 'hsl(var(--muted))'} as React.CSSProperties} />
              </div>
              <p className="text-sm text-muted-foreground">{callData.rationale}</p>
            </CardContent>
          </Card>

          <Card className="glassmorphic holographic-noise flex-grow flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mic className="text-primary" /> Live Transcription
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <ScrollArea className="h-full max-h-[300px] pr-4">
                <div className="text-lg leading-relaxed whitespace-pre-wrap font-mono">
                  {callData.transcription}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="glassmorphic holographic-noise">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <UserCheck className="text-primary" /> Caller Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Voiceprint Match:</span>
                <span className="font-bold" style={{color: riskColor}}>{callData.analysis.voiceprintMatch}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Number Legitimacy:</span>
                <span className="font-bold" style={{color: riskColor}}>{callData.analysis.numberLegitimacy}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="glassmorphic holographic-noise">
             <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                    <Bot className="text-primary" /> AI Analysis
                </CardTitle>
             </CardHeader>
             <CardContent className="space-y-3 text-sm">
                <p><strong className="text-muted-foreground">Sentiment:</strong> {callData.analysis.sentiment}</p>
                <p><strong className="text-muted-foreground">Urgency Detected:</strong> {callData.analysis.urgency ? 'Yes' : 'No'}</p>
                <p><strong className="text-muted-foreground">Synthetic Voice:</strong> {callData.analysis.syntheticVoice ? 'Detected' : 'Natural'}</p>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
