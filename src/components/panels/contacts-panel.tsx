"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ContactsPanel() {
  return (
    <div className="h-full flex flex-col gap-6 animate-text-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter">Contacts</h1>
        <p className="text-muted-foreground">Your trusted contacts.</p>
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
