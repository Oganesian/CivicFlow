import { createContext } from 'react';
import { User, UserRole } from '../api/types';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
