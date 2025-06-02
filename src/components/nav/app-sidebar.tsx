'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { NavMain } from '../nav-main';
// import { NavUser } from '../nav-user';
import { TeamSwitcher } from './team-switcher';
import { Microscope } from 'lucide-react';
import Image from 'next/image';

const navItems = [
  {
    title: 'Tratamentos',
    url: '/treatments', // Add a default or main url
    icon: Microscope,
    items: [
      { title: 'Todos', url: '/treatments' },
      { title: 'Criar novo', url: '/treatments/new' },
    ],
  },
  {
    title: 'Configurações',
    url: '/profile', // Add a default or main url
    items: [
      { title: 'Perfil', url: '/profile' },
      { title: 'Conta', url: '/account' },
    ],
  },
];

interface NavUserProps {
  user: {
    name: string;
    email: string;
    avatar: string; // Add this line
  };
}

export function NavUser({ user }: NavUserProps) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={user.avatar || '/default-avatar.png'}
        alt={user.name}
        width={32}
        height={32}
        className="w-8 h-8 rounded-full object-cover"
      />
      <div>
        <div className="font-medium">{user.name}</div>
        <div className="text-xs text-gray-500">{user.email}</div>
      </div>
    </div>
  );
}

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
