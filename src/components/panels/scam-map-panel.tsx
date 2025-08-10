
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { callHistory, callDescriptions } from "@/lib/mock-data";
import { AlertTriangle } from 'lucide-react';

const scamCalls = callHistory.filter(call => call.risk === 'high' || call.risk === 'medium');

export default function ScamMapPanel() {
  return (
    <div className="h-full flex flex-col gap-6 animate-text-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter">Scam Case Files</h1>
        <p className="text-muted-foreground">A log of detected scam and suspicious calls.</p>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {scamCalls.map((call) => (
          <Card key={call.id} className="glassmorphic-card holographic-noise shine-sweep">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className={call.risk === 'high' ? 'text-risk-danger' : 'text-risk-caution'} />
                Case #{call.id}: {call.contact}
              </CardTitle>
               <CardDescription>
                Risk Level: <span className={call.risk === 'high' ? 'text-risk-danger font-bold' : 'text-risk-caution font-bold'}>{call.risk.charAt(0).toUpperCase() + call.risk.slice(1)}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {callDescriptions[call.id] || "No description available for this case."}
              </p>
            </CardContent>
          </Card>
        ))}
       </div>
    </div>
  );
}
