import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize demo data and check for existing session
    apiService.initializeDemoData();
    
    const savedUserId = localStorage.getItem('currentUserId');
    if (savedUserId) {
      apiService.getUser(savedUserId).then(user => {
        setCurrentUser(user);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simplified login - in real app, this would validate credentials
    const users = JSON.parse(localStorage.getItem('referral_users') || '[]');
    const user = users.find((u: User) => u.email === email);
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUserId', user.id);
      return true;
    }
    return false;
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      const referralCode = `${userData.name.toUpperCase().replace(/\s+/g, '')}${Date.now().toString().slice(-4)}`;
      
      const newUser = await apiService.registerUser({
        name: userData.name,
        email: userData.email,
        referralCode,
        parentReferralCode: userData.parentReferralCode,
        level: userData.parentReferralCode ? 1 : 0,
        directReferrals: [],
        totalEarnings: 0,
        levelOneEarnings: 0,
        levelTwoEarnings: 0,
        isActive: true
      });

      setCurrentUser(newUser);
      localStorage.setItem('currentUserId', newUser.id);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUserId');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};