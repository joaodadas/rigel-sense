'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { NavMain } from '../nav-main';
import { NavUser } from '../nav-user';
import { TeamSwitcher } from './team-switcher';
import { Microscope } from 'lucide-react';

const navItems = [
  {
    title: 'Tratamentos',
    icon: Microscope,
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
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: 'João Vitor',
            email: 'medico@rigel.com',
            avatar: '', // pode usar alguma imagem depois
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
