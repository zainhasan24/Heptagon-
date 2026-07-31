import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, Mail } from 'lucide-react';
import { addNewsletterSubscription } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export function Newsletter() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      await addNewsletterSubscription(email, user?.uid);
      setIsLoading(false);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error adding subscription:', err);
      setError('Failed to save subscription. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <section className="relative bg-black py-20 px-4 sm:px-6 overflow-hidden border-t border-white/10">
      {/* Background noise and ambient gradient overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.12] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#101010] rounded-[2rem] p-8 sm:p-12 md:p-16 border border-white/10 relative overflow-hidden"
        >
          {/* Subtle accent backdrop blur circles */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-primary/70 text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium block">
              Heptagon Academic Dispatch
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#E1E0CC] font-normal tracking-tight">
              Join the <span className="font-serif italic text-primary">Heptagon</span> study hub.
            </h2>

            <p className="text-primary/60 text-xs sm:text-sm md:text-base leading-relaxed font-light">
              Receive weekly AI study guides, exam practice prompts, formula cheat sheets, and homework techniques straight to your inbox.
            </p>

            <div className="pt-6">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
                      <Check className="w-5 h-5" />
                    </div>
                    <p className="text-[#E1E0CC] text-sm sm:text-base font-medium">
                      You are now subscribed.
                    </p>
                    <p className="text-primary/50 text-xs">
                      We've dispatched a welcome note to <span className="text-primary/80">{email}</span>.
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setEmail('');
                      }}
                      className="mt-2 text-xs text-primary/60 hover:text-primary underline cursor-pointer transition-colors"
                    >
                      Subscribe another email
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto"
                  >
                    <div className="relative w-full">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 pointer-events-none" />
                      <input
                        type="email"
                        placeholder="Enter your email..."
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError('');
                        }}
                        disabled={isLoading}
                        className="w-full bg-black/80 border border-white/15 focus:border-primary/70 text-primary placeholder:text-primary/35 text-xs sm:text-sm rounded-full pl-11 pr-4 py-3.5 outline-none transition-all disabled:opacity-50"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group w-full sm:w-auto bg-primary text-black font-medium text-xs sm:text-sm px-6 py-3.5 rounded-full flex items-center justify-center gap-2 hover:bg-[#ECE8D5] active:scale-[0.98] transition-all shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      <span>{isLoading ? 'Subscribing...' : 'Subscribe'}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-3 font-light"
                >
                  {error}
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
