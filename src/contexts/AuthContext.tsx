import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User } from '../utils/types';
import { STORAGE_KEYS } from '../utils/constants';
import { authApi } from '../api/auth';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  signUp: (data: {
    email: string;
    name: string;
    phone: string;
    organization_name: string;
    organization_type: string;
    organization_size: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  setFirebaseUser: (firebaseUser: FirebaseUser, idToken: string) => void;
  setFirebaseUserFromRest: (uid: string, email: string, idToken: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get the ID token
          const idToken = await firebaseUser.getIdToken();
          
          // Store token and user info
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, idToken);
          
          // Create user object from Firebase user
          const userData: User = {
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            organizationId: '', // Will be fetched from backend if needed
            createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
            updatedAt: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
          };
          
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
          setToken(idToken);
          setUser(userData);
        } catch (error) {
          console.error('Error getting ID token:', error);
          setUser(null);
          setToken(null);
        }
      } else {
        // User is signed out
        setUser(null);
        setToken(null);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (email: string) => {
    try {
      await authApi.sendMagicLink(email);
      // Note: In a real app, you'd handle the magic link response
      // For now, we'll assume the token comes from the magic link callback
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (data: {
    email: string;
    name: string;
    phone: string;
    organization_name: string;
    organization_type: string;
    organization_size: string;
  }) => {
    try {
      await authApi.signUp(data);
      // After signup, user would typically be logged in or receive a magic link
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error signing out:', error);
      // Still clear local state even if Firebase signout fails
      setUser(null);
      setToken(null);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  };

  const setFirebaseUser = async (firebaseUser: FirebaseUser, idToken: string) => {
    setToken(idToken);
    
    // Create user object from Firebase user
    const userData: User = {
      id: firebaseUser.uid,
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      organizationId: '', // Will be fetched from backend if needed
      createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
      updatedAt: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
    };
    
    setUser(userData);
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, idToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  };

  // Overload for REST API response (uid, email, idToken)
  const setFirebaseUserFromRest = (uid: string, email: string, idToken: string) => {
    setToken(idToken);
    
    // Create user object
    const userData: User = {
      id: uid,
      uid: uid,
      email: email,
      organizationId: '', // Will be fetched from backend if needed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setUser(userData);
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, idToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    signUp,
    logout,
    setFirebaseUser,
    setFirebaseUserFromRest,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

