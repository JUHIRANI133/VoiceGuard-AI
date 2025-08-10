"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Shield, Bell, Globe, Languages } from "lucide-react";

export default function SettingsPanel() {
  return (
    <div className="h-full flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter text-glow">Settings</h1>
        <p className="text-muted-foreground">Customize your VoiceGuard AI experience.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glassmorphic holographic-noise">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="text-primary"/> Protection & Privacy</CardTitle>
            <CardDescription>Control how VoiceGuard AI protects you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
        </Card>

        <Card className="glassmorphic holographic-noise">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="text-primary"/> Alerts & Language</CardTitle>
            <CardDescription>Manage notifications and language preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end mt-4">
        <Button className="font-bold bg-primary text-black hover:bg-primary/90">Save Changes</Button>
      </div>
    </div>
  );
}
