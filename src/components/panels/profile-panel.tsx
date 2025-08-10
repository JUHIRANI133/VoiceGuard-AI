"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, Briefcase, BookOpenText } from 'lucide-react';
import { Separator } from "../ui/separator";

export default function ProfilePanel() {
  return (
    <div className="h-full flex flex-col gap-6 animate-text-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter">Profile</h1>
        <p className="text-muted-foreground">Your personal and professional information.</p>
      </div>
      <Card className="glassmorphic-card holographic-noise shine-sweep">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center text-center md:text-left md:space-x-8 space-y-4 md:space-y-0">
            <Avatar className="w-28 h-28 border-4 border-primary/50 shadow-lg">
              <AvatarImage src="https://placehold.co/128x128.png" alt="Aruna Mehta" data-ai-hint="indian woman divine" />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-glow-cyan">Aruna Mehta</h2>
              <p className="text-muted-foreground">Premium User</p>
              <div className="mt-2 flex items-center justify-center md:justify-start gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Professor at KIIT, Orissa</span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />

          <div className="space-y-6 text-sm">
             <div className="flex items-start gap-4">
                <BookOpenText className="w-5 h-5 text-primary mt-1" />
                <div>
                    <h3 className="font-semibold text-foreground">Bio</h3>
                    <p className="text-muted-foreground mt-1 leading-relaxed">
                        Aruna Mehta is a dedicated professor with over 15 years of experience in Computer Science at KIIT, Orissa. She is passionate about mentoring the next generation of tech innovators and is a respected figure in her community. A loving wife and mother, Aruna is the primary user of VoiceGuard AI, leveraging its technology to protect her family from the increasing threat of phone scams.
                    </p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-3 glassmorphic rounded-md">
                    <User className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">@aruna.mehta</span>
                </div>
                <div className="flex items-center gap-4 p-3 glassmorphic rounded-md">
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">a.mehta@kiit.ac.in</span>
                </div>
                 <div className="flex items-center gap-4 p-3 glassmorphic rounded-md">
                    <Phone className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">+91 12345 67890</span>
                </div>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
