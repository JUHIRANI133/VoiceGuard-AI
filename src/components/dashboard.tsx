"use client";

import { useContext } from 'react';
import { AppContext } from '@/contexts/app-context';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/app-sidebar';
import HomePanel from '@/components/panels/home-panel';
import LiveCallPanel from '@/components/panels/live-call-panel';
import IncidentReportsPanel from '@/components/panels/incident-reports-panel';
import KnowledgeHubPanel from '@/components/panels/knowledge-hub-panel';
import SettingsPanel from '@/components/panels/settings-panel';
import FloatingWidget from '@/components/floating-widget';

export default function Dashboard() {
  const { isCallActive, activePanel } = useContext(AppContext);

  const renderPanel = () => {
    if (isCallActive) {
      return <LiveCallPanel />;
    }
    switch (activePanel) {
      case 'home':
        return <HomePanel />;
      case 'reports':
        return <IncidentReportsPanel />;
      case 'knowledge':
        return <KnowledgeHubPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <HomePanel />;
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset className="p-4 md:p-6 animate-screen-swipe">
        {renderPanel()}
      </SidebarInset>
      {isCallActive && <FloatingWidget />}
    </SidebarProvider>
  );
}
