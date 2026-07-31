import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = '', showLabel = true }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle theme mode"
      title={theme === 'dark' ? 'Switch to High-Contrast Light Mode' : 'Switch to Dark Mode'}
      className={`flex items-center gap-1.5 text-[10px] sm:text-xs md:text-sm transition-all cursor-pointer whitespace-nowrap bg-white/5 hover:bg-white/10 active:scale-95 border border-white/15 px-3 py-1.5 rounded-full ${className}`}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-300 animate-spin-slow shrink-0" />
          {showLabel && <span className="text-primary/90">Light Mode</span>}
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          {showLabel && <span className="text-primary/90">Dark Mode</span>}
        </>
      )}
    </button>
  );
}
