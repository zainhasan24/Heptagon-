import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  onAuthStateChanged,
  signInWithGoogle,
  logoutUser,
  subscribeSavedWorks,
  subscribeUserLikes,
  saveWorkItem,
  unsaveWorkItem,
  toggleLikeWork,
  User,
} from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  savedWorkIds: string[];
  likedWorkIds: string[];
  signIn: () => Promise<User | null>;
  logout: () => Promise<void>;
  toggleSave: (workId: string) => Promise<void>;
  toggleLike: (workId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedWorkIds, setSavedWorkIds] = useState<string[]>([]);
  const [likedWorkIds, setLikedWorkIds] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setSavedWorkIds([]);
      setLikedWorkIds([]);
      return;
    }

    const unsubSaved = subscribeSavedWorks(user.uid, (ids) => {
      setSavedWorkIds(ids);
    });

    const unsubLikes = subscribeUserLikes(user.uid, (ids) => {
      setLikedWorkIds(ids);
    });

    return () => {
      unsubSaved();
      unsubLikes();
    };
  }, [user]);

  const signIn = async () => {
    return await signInWithGoogle();
  };

  const logout = async () => {
    await logoutUser();
  };

  const toggleSave = async (workId: string) => {
    if (!user) {
      await signInWithGoogle();
      return;
    }
    const isSaved = savedWorkIds.includes(workId);
    if (isSaved) {
      await unsaveWorkItem(user.uid, workId);
    } else {
      await saveWorkItem(user.uid, workId);
    }
  };

  const toggleLike = async (workId: string) => {
    if (!user) {
      await signInWithGoogle();
      return;
    }
    const isLiked = likedWorkIds.includes(workId);
    await toggleLikeWork(user.uid, workId, isLiked);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        savedWorkIds,
        likedWorkIds,
        signIn,
        logout,
        toggleSave,
        toggleLike,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
