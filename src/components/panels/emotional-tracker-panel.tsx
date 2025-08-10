"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function EmotionalTrackerPanel() {
  return (
    <div className="h-full flex flex-col gap-6 animate-text-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter">Emotional Tracker</h1>
        <p className="text-muted-foreground">Track emotional sentiment during calls.</p>
      </div>
       <Card className="glassmorphic-card">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This feature is currently under development.</p>
        </CardContent>
      </Card>
    </div>
  );
}
