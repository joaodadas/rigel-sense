import { create } from 'zustand';
import { mockUsers } from '@/mocks/users';

type Role = 'medico' | 'fisio';

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

type AuthStore = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: async (email, password) => {
    const found = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      set({ user: found });
      return true;
    }
    return false;
  },
  logout: () => set({ user: null }),
}));
