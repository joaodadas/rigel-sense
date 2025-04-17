// src/components/layouts/sidebar-layout.tsx
'use client';

import { ReactNode } from 'react';
import { AppSidebar } from '@/components/nav/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar'; // import necessário

export function SidebarLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">{children}</main>
      </div>
    </SidebarProvider>
  );
}
