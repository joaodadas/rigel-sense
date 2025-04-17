// src/components/nav/app-sidebar.tsx
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { NavMain } from '../nav-main';
import { NavUser } from '../nav-user';
import { GalleryVerticalEnd } from 'lucide-react';

const navItems = [
  {
    title: 'Tratamentos',
    icon: GalleryVerticalEnd,
    items: [
      { title: 'Todos', url: '/treatments' },
      { title: 'Criar novo', url: '/treatments/new' },
    ],
  },
  {
    title: 'Configurações',
    items: [
      { title: 'Perfil', url: '/profile' },
      { title: 'Conta', url: '/account' },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <h2 className="text-lg font-semibold">Rigel Sense</h2>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{ name: 'João Vitor', email: 'medico@rigel.com', avatar: '' }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
