import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Bookmark, LogOut, User, Sparkles, Check, Film, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function UserNav() {
  const { user, loading, savedWorkIds, likedWorkIds, signIn, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signIn();
    } catch (err: any) {
      if (
        err?.code !== 'auth/popup-closed-by-user' &&
        err?.code !== 'auth/cancelled-popup-request'
      ) {
        console.error('Sign-in failed:', err);
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="h-8 w-20 bg-white/5 animate-pulse rounded-full border border-white/10" />
    );
  }

  if (!user) {
    return (
      <button
        onClick={handleSignIn}
        disabled={isSigningIn}
        className="group relative flex items-center gap-2 bg-[#141414] hover:bg-primary hover:text-black text-primary/90 text-xs font-medium px-4 py-2 rounded-full border border-white/15 transition-all cursor-pointer shadow-lg shrink-0"
      >
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>{isSigningIn ? 'Connecting...' : 'Sign in'}</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#141414] hover:bg-white/10 text-[#E1E0CC] p-1.5 pr-3 rounded-full border border-white/15 transition-all cursor-pointer"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="w-6 h-6 rounded-full object-cover border border-primary/30"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
            {user.displayName?.[0] || 'U'}
          </div>
        )}
        <span className="text-xs font-medium max-w-[80px] truncate">
          {user.displayName?.split(' ')[0] || 'Member'}
        </span>
        {savedWorkIds.length > 0 && (
          <span className="bg-primary text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full">
            {savedWorkIds.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop click listener */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-64 bg-[#101010] border border-white/15 rounded-2xl shadow-2xl p-4 z-50 text-left"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-9 h-9 rounded-full object-cover border border-primary/30"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                    {user.displayName?.[0] || 'U'}
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="text-xs font-medium text-[#E1E0CC] truncate">
                    {user.displayName || 'Lab Member'}
                  </p>
                  <p className="text-[10px] text-primary/50 truncate">{user.email}</p>
                </div>
              </div>

              <div className="py-2 space-y-1">
                <div className="flex items-center justify-between text-xs py-2 px-2.5 rounded-lg bg-white/5 text-primary/80">
                  <span className="flex items-center gap-2">
                    <Bookmark className="w-3.5 h-3.5 text-primary" /> Saved Works
                  </span>
                  <span className="font-mono text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    {savedWorkIds.length}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-2 px-2.5 rounded-lg bg-white/5 text-primary/80">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Appreciations
                  </span>
                  <span className="font-mono text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    {likedWorkIds.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between text-xs py-2 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-primary/80 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    {theme === 'dark' ? (
                      <Sun className="w-3.5 h-3.5 text-amber-300" />
                    ) : (
                      <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    )}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  </span>
                  <span className="text-[9px] uppercase font-mono tracking-wider opacity-60">
                    Accessibility
                  </span>
                </button>
              </div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full mt-2 flex items-center justify-center gap-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 py-2 rounded-xl border border-red-500/20 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
