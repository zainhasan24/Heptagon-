import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Check, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { addInquiry } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

interface ContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROJECT_TYPES = [
  'Student Question / Brief',
  'Academic Institution',
  'AI Tutor Feature Request',
  'Research Collaboration',
  'Other Inquiry',
];

const BUDGET_RANGES = ['Student Free', 'Campus License', 'Institutional', 'Research'];

export function ContactDrawer({ isOpen, onClose }: ContactDrawerProps) {
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState('Student Question / Brief');
  const [budget, setBudget] = useState('Student Free');
  const [message, setMessage] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Auto pre-fill user info when logged in
  useEffect(() => {
    if (user) {
      if (user.displayName && !name) setName(user.displayName);
      if (user.email && !email) setEmail(user.email);
    }
  }, [user]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!message.trim()) {
      setError('Please provide a brief message about your project.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await addInquiry({
        name: name.trim(),
        email: email.trim(),
        projectType,
        budget,
        message: message.trim(),
        userId: user?.uid,
      });

      setIsLoading(false);
      setIsSuccess(true);
    } catch (err) {
      console.error('Failed to dispatch inquiry:', err);
      setError('Failed to send inquiry. Please try again.');
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setMessage('');
    setError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-md"
          />

          {/* Slide-In Side Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[100] w-full max-w-xl bg-[#0d0d0d] border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-y-auto"
          >
            {/* Ambient Overlay */}
            <div className="absolute inset-0 bg-noise opacity-[0.12] pointer-events-none" />

            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-white/10 flex items-center justify-between relative z-10 bg-[#0d0d0d]/80 backdrop-blur-md sticky top-0">
              <div>
                <span className="text-[10px] text-primary/60 tracking-[0.2em] uppercase font-mono block">
                  Student & Academic Support
                </span>
                <h2 className="text-xl sm:text-2xl text-[#E1E0CC] font-normal tracking-tight mt-0.5">
                  Connect with <span className="font-serif italic text-primary">Heptagon</span>
                </h2>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-primary border border-white/10 flex items-center justify-center transition-all cursor-pointer hover:rotate-90 duration-300 shrink-0"
                aria-label="Close Contact Panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Form Body */}
            <div className="p-6 sm:p-8 relative z-10 flex-1 space-y-6">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center my-auto py-12 space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center">
                    <Check className="w-7 h-7" />
                  </div>

                  <h3 className="text-2xl text-[#E1E0CC] font-normal">
                    Inquiry <span className="font-serif italic text-primary">Dispatched</span>
                  </h3>

                  <p className="text-primary/70 text-xs sm:text-sm max-w-md leading-relaxed font-light">
                    Thank you, <span className="text-primary">{name}</span>. Our studio leads review new project briefs within 24 hours. A copy of your notes has been logged for our upcoming curation call.
                  </p>

                  <div className="pt-6 flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                    <button
                      onClick={handleReset}
                      className="w-full py-3 px-4 rounded-full bg-white/5 hover:bg-white/10 text-primary text-xs font-medium border border-white/10 transition-all cursor-pointer"
                    >
                      Send Another Inquiry
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full py-3 px-4 rounded-full bg-primary text-black hover:bg-[#ECE8D5] text-xs font-medium transition-all cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <p className="text-primary/60 text-xs sm:text-sm leading-relaxed">
                    Have a feature project, film collaboration, or color grading study? Send us your brief and we'll reach back swiftly.
                  </p>

                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-[11px] text-primary/70 uppercase tracking-widest font-mono block">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Marcus Chen"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#141414] border border-white/10 focus:border-primary/80 text-primary placeholder:text-primary/30 text-xs sm:text-sm rounded-xl px-4 py-3 outline-none transition-all"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-[11px] text-primary/70 uppercase tracking-widest font-mono block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. marcus@parallax.studio"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#141414] border border-white/10 focus:border-primary/80 text-primary placeholder:text-primary/30 text-xs sm:text-sm rounded-xl px-4 py-3 outline-none transition-all"
                    />
                  </div>

                  {/* Project Type */}
                  <div className="space-y-2">
                    <label className="text-[11px] text-primary/70 uppercase tracking-widest font-mono block">
                      Project Discipline
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PROJECT_TYPES.map((type) => {
                        const isSelected = projectType === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setProjectType(type)}
                            className={`px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-primary text-black font-medium border border-primary'
                                : 'bg-[#141414] text-primary/60 hover:text-primary border border-white/10 hover:border-white/20'
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Budget Selector */}
                  <div className="space-y-2">
                    <label className="text-[11px] text-primary/70 uppercase tracking-widest font-mono block">
                      Estimated Budget Range
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {BUDGET_RANGES.map((b) => {
                        const isSelected = budget === b;
                        return (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setBudget(b)}
                            className={`py-2 px-3 text-center rounded-xl text-xs font-mono transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-primary/20 text-primary border border-primary'
                                : 'bg-[#141414] text-primary/50 hover:text-primary border border-white/10'
                            }`}
                          >
                            {b}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="space-y-2">
                    <label className="text-[11px] text-primary/70 uppercase tracking-widest font-mono block">
                      Project Brief / Message *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your timeline, creative vision, or specific technical requirements..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-[#141414] border border-white/10 focus:border-primary/80 text-primary placeholder:text-primary/30 text-xs sm:text-sm rounded-xl p-4 outline-none transition-all resize-none"
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-red-400 font-light bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                      {error}
                    </p>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group w-full bg-primary hover:bg-[#ECE8D5] text-black font-medium text-xs sm:text-sm py-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    <span>{isLoading ? 'Sending Inquiry...' : 'Submit Inquiry'}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-[#080808] text-[10px] text-primary/40 flex items-center justify-between font-mono">
              <span>HEPTAGON AI ACADEMICS</span>
              <span>SAN FRANCISCO / BOSTON / LONDON</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
