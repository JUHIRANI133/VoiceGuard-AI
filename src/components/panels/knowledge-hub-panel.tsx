"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ShieldQuestion, BookUser, Bot } from "lucide-react";

const articles = [
  {
    title: "Anatomy of a Tech Support Scam",
    description: "Learn how scammers impersonate major tech companies to gain access to your devices.",
    category: "Impersonation",
    icon: Bot
  },
  {
    title: "The 'Grandparent' Ploy: Emotional Manipulation",
    description: "Scammers pretend to be a relative in distress to trick you into sending money.",
    category: "Social Engineering",
    icon: BookUser
  },
  {
    title: "Understanding Synthetic Voice Scams",
    description: "Deepfake audio is on the rise. Know the signs of a computer-generated voice.",
    category: "Deepfake",
    icon: ShieldQuestion
  },
];

export default function KnowledgeHubPanel() {
  return (
    <div className="h-full flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter text-glow">Scam Knowledge Hub</h1>
        <p className="text-muted-foreground">Educate yourself on the latest scam tactics and prevention methods.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search for scam types, keywords..." className="pl-10 glassmorphic" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <Card key={index} className="glassmorphic holographic-noise flex flex-col justify-between hover:border-primary/80 transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-center gap-4">
                <article.icon className="w-8 h-8 text-primary" />
                <CardTitle className="text-lg text-glow">{article.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">{article.description}</p>
            </CardContent>
            <CardFooter>
              <p className="text-xs font-medium text-primary/80">{article.category}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
