
"use client";

import { useContext } from 'react';
import { ShieldCheck, LayoutDashboard, Contact, HeartPulse, FileText, Map, Settings, Globe, User, UploadCloud } from 'lucide-react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { AppContext } from '@/contexts/app-context';
import { cn } from '@/lib/utils';
import { translations } from '@/lib/i18n';

export default function AppSidebar() {
  const { activePanel, setActivePanel, isCallActive, t, language } = useContext(AppContext);

  const menuItems = [
    { id: 'home', label: t('sidebarHome'), icon: LayoutDashboard },
    { id: 'profile', label: t('sidebarProfile'), icon: User },
    { id: 'contacts', label: t('sidebarContacts'), icon: Contact },
    { id: 'uploaded-audio', label: t('sidebarUploadedAudio'), icon: UploadCloud },
    { id: 'emotional-tracker', label: t('sidebarEmotionalTracker'), icon: HeartPulse },
    { id: 'transcript', label: t('sidebarTranscript'), icon: FileText },
    { id: 'scam-map', label: t('sidebarScamMap'), icon: Map },
    { id: 'settings', label: t('sidebarSettings'), icon: Settings },
  ];

  const languageNames = {
    en: 'English (US)',
    hi: 'हिन्दी',
    es: 'Español',
    fr: 'Français',
  };

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 animate-text-fade-in">
          <ShieldCheck className="w-8 h-8 text-glow-cyan" />
          <div className="flex flex-col">
            <h2 className="text-lg font-bold tracking-tight font-headline">VoiceGuard AI</h2>
            <p className="text-xs text-muted-foreground">{t('sidebarTagline')}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item, index) => (
            <SidebarMenuItem 
              key={item.id} 
              className="animate-text-fade-in"
              style={{animationDelay: `${index * 100}ms`}}
            >
              <SidebarMenuButton
                onClick={() => setActivePanel(item.id as any)}
                isActive={activePanel === item.id && !isCallActive}
                className={cn(
                  "font-medium",
                  "transition-all duration-300",
                  "border border-transparent",
                  activePanel === item.id && !isCallActive && "glassmorphic border-primary/50 text-glow-cyan"
                )}
                tooltip={{children: item.label, side: "right"}}
                disabled={isCallActive}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator className="my-2" />
      <SidebarFooter className="p-4">
          <div className="flex items-center gap-2 p-2 rounded-lg glassmorphic">
            <Globe className="w-5 h-5 text-muted-foreground" />
            <div className="flex flex-col">
                <span className="text-sm font-medium">{t('languageLabel')}</span>
                <span className="text-xs text-muted-foreground">{languageNames[language]}</span>
            </div>
          </div>
      </SidebarFooter>
    </>
  );
}
