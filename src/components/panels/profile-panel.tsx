"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone } from 'lucide-react';

export default function ProfilePanel() {
  return (
    <div className="h-full flex flex-col gap-6 animate-text-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter">Profile</h1>
        <p className="text-muted-foreground">Manage your profile information.</p>
      </div>
      <Card className="glassmorphic-card">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar className="w-24 h-24 border-4 border-primary/50 shadow-lg">
              <AvatarImage src="https://placehold.co/100x100.png" alt="Aruna Mehta" data-ai-hint="woman portrait" />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-glow-cyan">Aruna Mehta</h2>
              <p className="text-muted-foreground">Premium User</p>
            </div>
          </div>
          <div className="mt-8 space-y-4 text-sm">
             <div className="flex items-center gap-4">
                <User className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">Username: @aruna.mehta</span>
             </div>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">email@example.com</span>
             </div>
             <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">+91 12345 67890</span>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
