"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Shield, Bell, Globe, Languages } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function SettingsPanel() {
  return (
    <div className="h-full flex flex-col gap-6 animate-text-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter">Settings</h1>
        <p className="text-muted-foreground">Customize your VoiceGuard AI experience.</p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-6">
        <AccordionItem value="item-1" className="border-none">
           <Card className="bg-background/50 border-primary/20">
            <AccordionTrigger className="p-6 hover:no-underline">
              <CardHeader className="p-0 text-left">
                <CardTitle className="flex items-center gap-2"><Shield className="text-primary"/> Protection & Privacy</CardTitle>
                <CardDescription>Control how VoiceGuard AI protects you.</CardDescription>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="space-y-6 pt-0">
                <div className="flex items-center justify-between">
                  <Label htmlFor="protection-mode">Protection Mode</Label>
                  <Select defaultValue="cloud">
                    <SelectTrigger id="protection-mode" className="w-[180px] glassmorphic">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent className="glassmorphic">
                      <SelectItem value="cloud">Cloud (Max Accuracy)</SelectItem>
                      <SelectItem value="on-device">On-Device (Privacy)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="privacy-mode">On-Device Privacy Mode</Label>
                  <Switch id="privacy-mode" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="ephemeral-storage">Ephemeral Storage</Label>
                  <Switch id="ephemeral-storage" defaultChecked />
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
        
        <AccordionItem value="item-2" className="border-none">
          <Card className="bg-background/50 border-primary/20">
            <AccordionTrigger className="p-6 hover:no-underline">
              <CardHeader className="p-0 text-left">
                <CardTitle className="flex items-center gap-2"><Bell className="text-primary"/> Alerts & Language</CardTitle>
                <CardDescription>Manage notifications and language preferences.</CardDescription>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="space-y-6 pt-0">
                 <div className="flex items-center justify-between">
                  <Label htmlFor="alert-sound">Alert Sound</Label>
                  <Switch id="alert-sound" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="haptic-feedback">Haptic Feedback</Label>
                  <Switch id="haptic-feedback" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="language"><Globe className="inline-block mr-2 h-4 w-4"/> Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language" className="w-[180px] glassmorphic">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="glassmorphic">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिन्दी</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>
      
      <div className="flex justify-end mt-auto">
        <Button className="font-bold">Save Changes</Button>
      </div>
    </div>
  );
}
